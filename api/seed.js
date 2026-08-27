const fs = require('fs');
const path = require('path');

// --- Random utilities ---
function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function pickRandom(arr, random) {
  return arr[Math.floor(random() * arr.length)];
}

// --- Doctor generation ---
const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan',
  'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Myra', 'Sara', 'Aanya', 'Aadhya',
  'Isha', 'Riya', 'Priya', 'Neha', 'Rahul', 'Amit', 'Vikram', 'Sanjay',
  'Deepak', 'Pooja', 'Kavita', 'Meera', 'Lakshmi', 'Rajesh', 'Sunita', 'Anil',
];
const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Reddy', 'Nair',
  'Iyer', 'Menon', 'Joshi', 'Desai', 'Mehta', 'Shah', 'Rao', 'Pillai',
  'Chatterjee', 'Banerjee', 'Mukherjee', 'Das', 'Bose', 'Sen', 'Ghosh',
  'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Srivastava', 'Agarwal', 'Saxena',
];
const SPECIALIZATIONS = [
  'General Ayurveda', 'Panchakarma', 'Skin & Hair', 'Digestive Health',
  'Mental Wellness', "Women's Health", 'Child Care', 'Joint & Spine',
  'Weight Management', 'Respiratory Health',
];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi'];
const CLINIC_PREFIXES = ['Ayur', 'Pancha', 'Veda', 'Sattva', 'Prakruti', 'Dosha', 'Roga', 'Arogya', 'Chikitsa', 'Sundar', 'Amrut', 'Divya', 'Swasth', 'Vaidya', 'Naturo'];
const CLINIC_SUFFIXES = ['Clinic', 'Center', 'Wellness', 'Ayurveda', 'Panchakarma', 'Healing', 'Therapeutics', 'Health Hub', 'Care', 'Center for Ayurveda'];
const AREAS = ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar', 'JP Nagar', 'Marathahalli', 'Electronic City', 'Banashankari', 'BTM Layout'];

function generateDoctor(index) {
  const random = seededRandom(index + 1);
  const firstName = pickRandom(FIRST_NAMES, random);
  const lastName = pickRandom(LAST_NAMES, random);
  const specialization = pickRandom(SPECIALIZATIONS, random);
  const experience = Math.floor(random() * 35) + 1;
  const rating = Math.round((3.0 + random() * 2.0) * 10) / 10;
  const reviewCount = Math.floor(random() * 500);
  const consultationFee = (Math.floor(random() * 20) + 2) * 50;
  const isAvailable = random() > 0.2;
  const slotDuration = [15, 20, 30, 45, 60][Math.floor(random() * 5)];
  const numLang = 1 + Math.floor(random() * 3);
  const langs = ['English'];
  const availLangs = LANGUAGES.filter(l => l !== 'English');
  for (let i = 0; i < numLang - 1 && availLangs.length > 0; i++) {
    const idx = Math.floor(random() * availLangs.length);
    langs.push(availLangs[idx]);
    availLangs.splice(idx, 1);
  }

  return {
    id: `doc_${index.toString().padStart(5, '0')}`,
    name: random() > 0.5 ? `Dr. ${firstName} ${lastName}` : `${firstName} ${lastName}`,
    photoUrl: `https://api.dicebear.com/7.x/person/svg?seed=${index}`,
    specialization,
    experience,
    rating,
    reviewCount,
    consultationFee,
    languages: langs,
    availability: {
      isAvailable,
      nextAvailableSlot: isAvailable ? new Date(Date.now() + (Math.floor(random() * 72) + 1) * 3600000).toISOString() : null,
      slotDuration,
    },
    bio: `Experienced ${specialization} practitioner dedicated to holistic Ayurvedic healing.`,
    clinicName: `${pickRandom(CLINIC_PREFIXES, random)} ${pickRandom(CLINIC_SUFFIXES, random)}`,
    clinicAddress: `${Math.floor(random() * 999) + 1}, ${pickRandom(AREAS, random)}, Bangalore`,
  };
}

function generateSlots(doctorId) {
  const random = seededRandom(doctorId.charCodeAt(4) * 100 + doctorId.charCodeAt(5));
  const slots = [];
  const types = ['video', 'audio', 'chat', 'in-person'];
  for (let day = 0; day < 7; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    date.setHours(0, 0, 0, 0);
    for (let hour = 9; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (random() > 0.7) continue;
        const start = new Date(date);
        start.setHours(hour, min, 0, 0);
        const end = new Date(start.getTime() + 30 * 60000);
        slots.push({
          id: `slot_${doctorId}_${start.getTime()}`,
          doctorId,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          isBooked: random() > 0.8,
          consultationType: pickRandom(types, random),
        });
      }
    }
  }
  return slots;
}

// --- Product generation ---
const PRODUCT_NAMES = {
  'Herbal Supplements': ['Ashwagandha Capsules', 'Triphala Tablets', 'Brahmi Memory Plus', 'Tulsi Giloy Juice', 'Amla Immunity Boost', 'Shilajit Resin', 'Moringa Leaf Powder', 'Neem Capsules', 'Guggulu Joint Support', 'Shatavari Powder', 'Haritaki Digestive', 'Bhringraj Hair Herbs'],
  'Oils & Ghee': ['Brahmi Hair Oil', 'Bhringraj Oil', 'Dhanvantari Tailam', 'Ksheerabala Oil', 'Mahanarayan Oil', 'Sesame Cold Pressed', 'Bilva Ghee', 'Desi Cow Ghee', 'Mustard Oil', 'Coconut Oil'],
  'Skin Care': ['Kumkumadi Face Oil', 'Saffron Glow Cream', 'Aloe Vera Gel', 'Neem Face Pack', 'Multani Mitti Pack', 'Rose Water Toner', 'Ubtan Scrub', 'Sandalwood Paste', 'Turmeric Glow Serum'],
  'Hair Care': ['Bhringraj Shampoo', 'Amla Hair Mask', 'Onion Hair Oil', 'Hair Growth Serum', 'Henna Mehendi', 'Herbal Conditioner'],
  'Immunity': ['Chyawanprash', 'Giloy Ghanvati', 'Tulsi Drops', 'Amla Juice', 'Immunity Kadha', 'Vitamin C Natural'],
  'Digestive Health': ['Ajwain Capsules', 'Isabgol Husk', 'Triphala Churna', 'Ginger Honey Crystals', 'Buttermilk Masala', 'Hingvastak Churna'],
  'Respiratory': ['Sitopaladi Churna', 'Vasaka Leaves', 'Mulethi Sticks', 'Tulsi Cough Syrup', 'Pippali Rasayana'],
  'Joint Care': ['Boswellia Capsules', 'Turmeric Curcumin', 'Nirgundi Oil', 'Lakshadi Guggulu', 'Yoga Guggulu'],
  "Women's Wellness": ['Shatavari Kalp', 'Lohasava Iron Tonic', 'Kumari Asava', 'Shatavari Granules', 'Menstrual Health Tea'],
  "Men's Wellness": ['Shilajit Gold', 'Musli Pak', 'Ashwagandha Pro', 'Vitality Capsules', 'Testo Support Blend'],
  'Kids & Baby': ['Baby Massage Oil', 'Kids Immunity Drops', 'Baby Shampoo', 'Calcium Plus Kids', 'Kids Chyawanprash'],
  'Food & Beverages': ['Organic Turmeric', 'Ayurvedic Coffee Substitute', 'Moringa Powder', 'Triphala Tea', 'Herbal Green Tea'],
  'Personal Care': ['Herbal Soap', 'Drumstick Bath Powder', 'Activated Charcoal Soap', 'Herbal Hand Sanitizer', 'Neem Twigs Brush'],
  'Home Remedies': ['Vicks Ayurvedic Balm', 'Herbal Inhaler', 'Nasal Drops', 'Eye Wash Triphala', 'Ear Drops Garlic Oil'],
};
const CATEGORIES = Object.keys(PRODUCT_NAMES);
const TAGS_POOL = ['bestseller', 'new', 'organic', 'vegan', 'ayush', 'fssai', 'ayurvedic', 'natural', 'herbal', 'traditional', 'premium', 'eco-friendly', 'handmade', 'cold-pressed', 'raw'];
const SUFFIXES = ['Plus', 'Pro', 'Gold', 'Max', 'Extra', 'Boost', 'Elite', 'Original'];

function generateProduct(index) {
  const random = seededRandom(index + 1);
  const category = pickRandom(CATEGORIES, random);
  const names = PRODUCT_NAMES[category];
  const baseName = names[index % names.length];
  const variant = Math.floor(index / names.length);
  const name = variant === 0 ? baseName : `${baseName} ${SUFFIXES[variant % SUFFIXES.length]}`;
  const numTags = 1 + Math.floor(random() * 3);
  const tags = [];
  const availTags = [...TAGS_POOL];
  for (let i = 0; i < numTags && availTags.length > 0; i++) {
    const idx = Math.floor(random() * availTags.length);
    tags.push(availTags[idx]);
    availTags.splice(idx, 1);
  }

  return {
    id: `prod_${index.toString().padStart(5, '0')}`,
    name,
    description: `Premium ${category.toLowerCase()} product crafted with traditional Ayurvedic ingredients for holistic wellness.`,
    category,
    price: Math.round((random() * 4900 + 50) * 100) / 100,
    currency: 'INR',
    imageUrl: `https://picsum.photos/seed/${index}/400/400`,
    rating: Math.round((3.0 + random() * 2.0) * 10) / 10,
    reviewCount: Math.floor(random() * 2000),
    stock: Math.floor(random() * 500),
    tags,
  };
}

// --- Health record generation ---
const RECORD_TYPES = ['lab_report', 'prescription', 'consultation', 'vaccination', 'allergy'];
const RECORD_TITLES = {
  lab_report: ['Complete Blood Count', 'Liver Function Test', 'Kidney Function Test', 'Lipid Profile', 'Thyroid Profile', 'Vitamin D Levels', 'Blood Sugar Fasting', 'HbA1c', 'Urine Routine', 'ECG Report'],
  prescription: ['Ayurvedic Prescription', 'Herbal Formulation', 'Traditional Remedy', 'Panchakarma Prescription', 'Herbal Decotion', 'Churna Prescription', 'Oil Prescription', 'Ghee Based Formulation', 'Tablet Prescription'],
  consultation: ['Initial Consultation', 'Follow-up Visit', 'Wellness Check', 'Dosha Assessment', 'Annual Review', 'Specialist Consultation', 'Video Consultation', 'In-Person Consultation', 'Telemedicine Session'],
  vaccination: ['COVID-19 Booster', 'Hepatitis B', 'Influenza Vaccine', 'Pneumococcal Vaccine', 'Typhoid Vaccine', 'MMR Booster', 'Tetanus Toxoid', 'Rabies Pre-exposure', 'Japanese Encephalitis'],
  allergy: ['Dust Allergy Test', 'Food Allergy Panel', 'Pollen Allergy', 'Drug Allergy Test', 'Insect Sting Allergy', 'Mold Allergy', 'Pet Dander Allergy', 'Latex Allergy', 'Nickel Allergy'],
};
const RECORD_LABELS = { lab_report: 'Lab Report', prescription: 'Prescription', consultation: 'Consultation', vaccination: 'Vaccination', allergy: 'Allergy' };
const TAG_POOL = ['annual', 'follow-up', 'urgent', 'routine', 'preventive', 'chronic', 'acute', 'wellness', 'screening', 'monitoring', 'ayurvedic', 'modern', 'integrated', 'digital', 'physical'];

function generateHealthRecord(index) {
  const random = seededRandom(index + 1);
  const type = pickRandom(RECORD_TYPES, random);
  const title = pickRandom(RECORD_TITLES[type], random);
  const daysAgo = Math.floor(random() * 1825);
  const numTags = 1 + Math.floor(random() * 3);
  const tags = [];
  const availTags = [...TAG_POOL];
  for (let i = 0; i < numTags && availTags.length > 0; i++) {
    const idx = Math.floor(random() * availTags.length);
    tags.push(availTags[idx]);
    availTags.splice(idx, 1);
  }
  const numAtt = Math.floor(random() * 4);
  const attachments = [];
  for (let i = 0; i < numAtt; i++) {
    const isPdf = random() > 0.7;
    attachments.push({
      id: `att_${(index * 10 + i).toString().padStart(5, '0')}`,
      name: isPdf ? `document_${index}.pdf` : `scan_${index}.png`,
      mimeType: isPdf ? 'application/pdf' : 'image/png',
      thumbnailUrl: !isPdf ? `https://picsum.photos/seed/${index}/200/200` : undefined,
      uri: isPdf ? `file:///documents/document_${index}.pdf` : undefined,
      sizeBytes: Math.floor(random() * 5000000) + 50000,
    });
  }

  return {
    id: `rec_${index.toString().padStart(5, '0')}`,
    patientId: 'patient_001',
    type,
    title: `${title} - ${RECORD_LABELS[type]}`,
    description: `This is a ${RECORD_LABELS[type].toLowerCase()} record for patient patient_001.`,
    occurredAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    tags,
    attachments,
    metadata: { generated: true, recordIndex: index, source: 'mock' },
  };
}

// --- Build DB ---
console.log('Generating doctors (100)...');
const doctors = [];
for (let i = 0; i < 100; i++) doctors.push(generateDoctor(i));

console.log('Generating slots...');
const slots = [];
for (const doc of doctors) slots.push(...generateSlots(doc.id));

console.log('Generating products (500)...');
const products = [];
for (let i = 0; i < 500; i++) products.push(generateProduct(i));

console.log('Generating health records (500)...');
const healthRecords = [];
for (let i = 0; i < 500; i++) healthRecords.push(generateHealthRecord(i));

const db = {
  doctors,
  slots,
  products,
  healthRecords,
  bookings: [],
};

const outPath = path.join(__dirname, 'db.json');
fs.writeFileSync(outPath, JSON.stringify(db, null, 2));
console.log(`Written to ${outPath}`);
console.log(`  doctors: ${doctors.length}`);
console.log(`  slots: ${slots.length}`);
console.log(`  products: ${products.length}`);
console.log(`  healthRecords: ${healthRecords.length}`);
