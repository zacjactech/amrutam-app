const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// --- Failure injection ---
function shouldFail(req) {
  const url = req.query.failure;
  if (!url) return null;
  const failures = {
    timeout: () => new Promise(() => {}), // hangs forever
    server: () => ({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }),
    'invalid-json': () => 'not json at all {{{',
    empty: () => ({ data: [], meta: { total: 0, page: 1, limit: 20, hasNextPage: false } }),
    'session-expired': () => ({ error: { code: 'SESSION_EXPIRED', message: 'Session expired. Please log in again.' } }),
  };
  return failures[url] || null;
}

// --- Booking POST: conflict + expiry logic ---
const originalPost = router.render.bind(router);
router.render = (req, res) => {
  // Booking creation
  if (req.method === 'POST' && req.url === '/bookings') {
    const body = req.body;
    const db = router.db;

    // Check slot exists
    const slot = db.get('slots').find({ id: body.slotId }).value();
    if (!slot) {
      return res.status(404).jsonp({ error: { code: 'NOT_FOUND', message: 'Slot not found' } });
    }

    // Check slot expired
    if (new Date(slot.startTime) < new Date()) {
      return res.status(409).jsonp({ error: { code: 'SLOT_EXPIRED', message: 'This slot has expired' } });
    }

    // Check slot already booked
    if (slot.isBooked) {
      const existingBooking = db.get('bookings').find({ slotId: body.slotId, status: 'confirmed' }).value();
      if (existingBooking) {
        return res.status(409).jsonp({ error: { code: 'SLOT_CONFLICT', message: 'This slot is already booked' } });
      }
    }

    // Idempotency: check duplicate
    if (body.idempotencyKey) {
      const existing = db.get('bookings').find({ idempotencyKey: body.idempotencyKey }).value();
      if (existing) {
        req.locals = { data: existing };
        return originalPost(req, res);
      }
    }

    // Create booking
    const booking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      doctorId: body.doctorId,
      patientId: body.patientId || 'patient_001',
      slotId: body.slotId,
      consultationType: body.consultationType || 'video',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      idempotencyKey: body.idempotencyKey || `idem_${Date.now()}`,
      notes: body.notes || '',
    };

    // Mark slot as booked
    db.get('slots').find({ id: body.slotId }).assign({ isBooked: true }).write();

    // Add booking
    db.get('bookings').push(booking).write();

    req.locals = { data: booking };
    return originalPost(req, res);
  }

  // Cancel booking
  if (req.method === 'POST' && req.url.match(/\/bookings\/.*\/cancel/)) {
    const bookingId = req.url.split('/')[2];
    const db = router.db;
    const booking = db.get('bookings').find({ id: bookingId }).value();

    if (!booking) {
      return res.status(404).jsonp({ error: { code: 'NOT_FOUND', message: 'Booking not found' } });
    }

    if (booking.status === 'cancelled') {
      return res.status(409).jsonp({ error: { code: 'ALREADY_CANCELLED', message: 'Booking is already cancelled' } });
    }

    db.get('bookings').find({ id: bookingId }).assign({
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    }).write();

    // Free up the slot
    db.get('slots').find({ id: booking.slotId }).assign({ isBooked: false }).write();

    const updated = db.get('bookings').find({ id: bookingId }).value();
    req.locals = { data: updated };
    return originalPost(req, res);
  }

  originalPost(req, res);
};

// --- Query parameter support for filtering ---
server.use((req, res, next) => {
  if (req.method === 'GET') {
    // Add request ID
    res.header('x-request-id', `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  }
  next();
});

server.use(router);

const PORT = process.env.API_PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n  Amrutam Mock API running at http://localhost:${PORT}`);
  console.log(`\n  Endpoints:`);
  console.log(`    GET  /doctors`);
  console.log(`    GET  /doctors/:id`);
  console.log(`    GET  /slots?doctorId=xxx`);
  console.log(`    GET  /products`);
  console.log(`    GET  /products/:id`);
  console.log(`    GET  /healthRecords`);
  console.log(`    GET  /healthRecords/:id`);
  console.log(`    POST /bookings`);
  console.log(`    GET  /bookings`);
  console.log(`    POST /bookings/:id/cancel`);
  console.log(`\n  Failure injection: add ?failure=timeout|server|invalid-json|empty|session-expired`);
  console.log(`\n  Filtering: ?_limit=20&_page=1&_sort=rating&_order=desc`);
  console.log(`  Full-text: ?q=searchterm\n`);
});
