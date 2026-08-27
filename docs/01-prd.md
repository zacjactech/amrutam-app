# Product Requirements Document

## 1. Product Overview

The product is a mobile Ayurvedic health super app composed of three modules that share common application infrastructure but remain independently maintainable.

The user can discover doctors and book consultations, browse Ayurvedic products and manage a cart, and review health records through a searchable timeline.

## 2. Personas

### Patient

Needs to:

- Find an appropriate doctor.
- See available appointment times.
- Book or cancel a consultation.
- Shop for health products.
- Keep a persistent cart.
- Access historical health records quickly.
- Continue basic workflows when connectivity is unavailable.

## 3. Core User Journeys

### Consultation journey

Home → Consult → Search/filter doctors → Doctor details → Select slot → Confirm booking → Upcoming consultations.

Cancellation:

Upcoming consultation → Consultation details → Cancel → Confirm → Updated status.

Offline booking:

Select slot → Confirm → Local pending booking → Connectivity returns → Sync engine submits booking → Conflict/success result → UI updated.

### Shop journey

Home → Shop → Search/filter/sort → Product details → Add to cart → Adjust quantity → Checkout summary.

Offline:

Browse cached products → Add/update cart → Persist locally → Reconnect → Cart remains available.

### Health Records journey

Home → Health Records → Timeline → Search/filter/tag → Record details → Attachment preview.

## 4. Functional Requirements

### FR-C01 Doctor Listing

Display a virtualized list of doctors. Each doctor should contain at minimum:

- ID
- Name
- Specialty
- Avatar
- Rating
- Consultation fee
- Experience
- Availability indicator

### FR-C02 Search and Filters

Doctor search must support text search. Filters should include practical dimensions such as specialty, rating, fee range, and availability.

Filtering should be performed against the current dataset without rendering all records simultaneously.

### FR-C03 Doctor Details

Display doctor information and available slots.

### FR-C04 Booking

Booking requires:

- Doctor
- Slot
- Patient
- Booking ID
- Status
- Created timestamp

A slot must not be booked twice.

### FR-C05 Expired Slot

A slot whose start time has passed must be rejected even if it was previously cached.

### FR-C06 Cancellation

A cancellable upcoming booking can be cancelled. The UI must update immediately and reconcile with the remote result.

### FR-S01 Product Listing

Display a virtualized product feed with:

- ID
- Name
- Category
- Price
- Image
- Rating
- Stock
- Tags

### FR-S02 Infinite Scroll

Load products page-by-page. Do not load 20,000 records into the render tree.

### FR-S03 Search, Filter, Sort

Support independent search, multiple filters, and sorting.

### FR-S04 Cart

Support:

- Add item
- Remove item
- Increase quantity
- Decrease quantity
- Clear cart
- Persist cart

### FR-S05 Wishlist

Allow products to be added/removed from a local wishlist.

### FR-S06 Checkout Summary

Show:

- Items
- Quantities
- Subtotal
- Shipping
- Total

No real payment is required.

### FR-H01 Timeline

Render health records grouped by month/year.

### FR-H02 Record Types

Support lab reports, prescriptions, consultations, vaccinations, and allergies.

### FR-H03 Search/Filter/Tags

Search and filter the timeline without loading all records into visible React components.

### FR-H04 Attachments

Display image/PDF thumbnail metadata and preview states.

## 5. Reliability Requirements

The app must handle:

- Offline mode
- Slow network
- Timeout
- Random server failures
- Empty response
- Partial response
- Invalid JSON
- Session expiration
- Duplicate booking
- Expired booking slot

The UI must never become permanently stuck behind a loading indicator.

## 6. Non-Functional Requirements

### Performance

The app must remain responsive with:

- 5,000 doctors
- 20,000 products
- 10,000 health records

### Accessibility

Support:

- Screen-reader labels
- Sufficient touch target size
- Dynamic text where practical
- Logical focus/navigation order
- Semantic button labels
- Meaningful status announcements

### Theming

Support light and dark themes through semantic design tokens rather than hard-coded colors.

## 7. Acceptance Criteria

The reviewer should be able to:

1. Search/filter a large doctor dataset.
2. Book an available slot.
3. Attempt to book the same slot twice and see a conflict.
4. Attempt an expired slot and receive a clear error.
5. Cancel an upcoming booking.
6. Scroll a 20,000-product dataset smoothly.
7. Search/filter/sort products.
8. Close/reopen the app and retain the cart.
9. Navigate health records grouped by month/year.
10. Preview an attachment.
11. Disable connectivity and continue cached/cart workflows.
12. Queue a booking while offline.
13. Restore connectivity and observe automatic synchronization.
