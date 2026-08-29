-- Amrutam Seed - General data only (doctors, slots, products)
-- No user-specific data (bookings, health_records, cart, wishlist)

-- ─── 100 Doctors ─────────────────────────────────────────────────────────────

DO $$
DECLARE
  i INT;
  first_names TEXT[] := ARRAY['Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Reyansh','Ayaan','Krishna','Ishaan','Ananya','Diya','Myra','Sara','Aanya','Aadhya','Isha','Riya','Priya','Neha','Rahul','Amit','Vikram','Sanjay','Deepak','Pooja','Kavita','Meera','Lakshmi','Rajesh','Sunita','Anil'];
  last_names TEXT[] := ARRAY['Sharma','Verma','Patel','Gupta','Singh','Kumar','Reddy','Nair','Iyer','Menon','Joshi','Desai','Mehta','Shah','Rao','Pillai','Chatterjee','Banerjee','Mukherjee','Das','Bose','Sen','Ghosh','Mishra','Pandey','Tiwari','Dubey','Srivastava','Agarwal','Saxena'];
  specializations TEXT[] := ARRAY['General Ayurveda','Panchakarma','Skin & Hair','Digestive Health','Mental Wellness','Women''s Health','Child Care','Joint & Spine','Weight Management','Respiratory Health'];
  languages_pool TEXT[] := ARRAY['English','Hindi','Tamil','Telugu','Kannada','Malayalam','Bengali','Marathi','Gujarati','Punjabi'];
  clinic_prefixes TEXT[] := ARRAY['Ayur','Pancha','Veda','Sattva','Prakruti','Dosha','Roga','Arogya','Chikitsa','Sundar','Amrut','Divya','Swasth','Vaidya','Naturo'];
  clinic_suffixes TEXT[] := ARRAY['Clinic','Center','Wellness','Ayurveda','Panchakarma','Healing','Therapeutics','Health Hub','Care','Center for Ayurveda'];
  areas TEXT[] := ARRAY['Koramangala','Indiranagar','HSR Layout','Whitefield','Jayanagar','JP Nagar','Marathahalli','Electronic City','Banashankari','BTM Layout'];
  fname TEXT;
  lname TEXT;
  spec TEXT;
  exp INT;
  rat NUMERIC(2,1);
  rev_cnt INT;
  fee INT;
  is_avail BOOLEAN;
  slot_dur INT;
  lang_count INT;
  langs TEXT[];
  avail_langs TEXT[];
  j INT;
  clinic_p TEXT;
  clinic_s TEXT;
  area TEXT;
  area_num INT;
  slot_durations INT[] := ARRAY[15, 20, 30, 45, 60];
BEGIN
  FOR i IN 0..99 LOOP
    fname := first_names[(i % array_length(first_names, 1)) + 1];
    lname := last_names[((i * 7) % array_length(last_names, 1)) + 1];
    spec := specializations[(i % array_length(specializations, 1)) + 1];
    exp := (i * 13 % 35) + 1;
    rat := ROUND((3.0 + (i * 3 % 20) / 10.0)::numeric, 1);
    rev_cnt := (i * 47) % 500;
    fee := ((i * 11 % 20) + 2) * 50;
    is_avail := (i % 5) != 0;
    slot_dur := slot_durations[(i % 5) + 1];
    lang_count := 1 + (i % 3);
    langs := ARRAY['English'];
    avail_langs := ARRAY['Hindi','Tamil','Telugu','Kannada','Malayalam','Bengali','Marathi','Gujarati','Punjabi'];
    FOR j IN 2..lang_count LOOP
      IF array_length(avail_langs, 1) > 0 THEN
        langs := array_append(langs, avail_langs[((i * j) % array_length(avail_langs, 1)) + 1]);
      END IF;
    END LOOP;
    clinic_p := clinic_prefixes[(i % array_length(clinic_prefixes, 1)) + 1];
    clinic_s := clinic_suffixes[(i * 3 % array_length(clinic_suffixes, 1)) + 1];
    area := areas[(i % array_length(areas, 1)) + 1];
    area_num := (i * 17 % 999) + 1;

    INSERT INTO doctors (id, name, photo_url, specialization, experience, rating, review_count, consultation_fee, languages, availability, bio, clinic_name, clinic_address)
    VALUES (
      'doc_' || lpad(i::text, 5, '0'),
      CASE WHEN i % 2 = 0 THEN 'Dr. ' || fname || ' ' || lname ELSE fname || ' ' || lname END,
      'https://api.dicebear.com/7.x/person/svg?seed=' || i,
      spec,
      exp,
      rat,
      rev_cnt,
      fee,
      langs,
      jsonb_build_object('isAvailable', is_avail, 'nextAvailableSlot', CASE WHEN is_avail THEN (now() + ((i * 13 % 72) + 1 || ' hours')::interval)::text ELSE null END, 'slotDuration', slot_dur),
      'Experienced ' || spec || ' practitioner dedicated to holistic Ayurvedic healing.',
      clinic_p || ' ' || clinic_s,
      area_num || ', ' || area || ', Bangalore'
    );
  END LOOP;
END $$;

-- ─── Slots for each doctor (7 days ahead) ────────────────────────────────────

DO $$
DECLARE
  doc RECORD;
  day_offset INT;
  hour INT;
  m INT;
  slot_start TIMESTAMPTZ;
  slot_end TIMESTAMPTZ;
  consult_type TEXT;
  is_booked BOOLEAN;
  types TEXT[] := ARRAY['video','audio','chat','in-person'];
  minutes_arr INT[] := ARRAY[0, 30];
BEGIN
  FOR doc IN SELECT id FROM doctors LOOP
    FOR day_offset IN 0..6 LOOP
      FOR hour IN 9..17 LOOP
        FOREACH m IN ARRAY minutes_arr LOOP
          IF hour = 17 AND m > 0 THEN EXIT; END IF;
          IF (length(doc.id)::int * 7 + day_offset * 3 + hour + m) % 4 = 0 THEN CONTINUE; END IF;

          slot_start := (date_trunc('day', now()) + (day_offset || ' days')::interval + (hour || ' hours')::interval + (m || ' minutes')::interval);
          slot_end := slot_start + '30 minutes'::interval;
          consult_type := types[((length(doc.id)::int + day_offset + hour + m) % 4) + 1];
          is_booked := (length(doc.id)::int * 3 + day_offset + hour) % 5 = 0;

          INSERT INTO slots (id, doctor_id, start_time, end_time, is_booked, consultation_type)
          VALUES (
            'slot_' || doc.id || '_' || extract(epoch from slot_start)::bigint,
            doc.id,
            slot_start,
            slot_end,
            is_booked,
            consult_type
          );
        END LOOP;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- ─── 500 Products ────────────────────────────────────────────────────────────

DO $$
DECLARE
  i INT;
  categories TEXT[] := ARRAY['Herbal Supplements','Oils & Ghee','Skin Care','Hair Care','Immunity','Digestive Health','Respiratory','Joint Care','Women''s Wellness','Men''s Wellness','Kids & Baby','Food & Beverages','Personal Care','Home Remedies'];
  product_names JSONB := '{
    "1": ["Ashwagandha Capsules","Triphala Tablets","Brahmi Memory Plus","Tulsi Giloy Juice","Amla Immunity Boost","Shilajit Resin","Moringa Leaf Powder","Neem Capsules","Guggulu Joint Support","Shatavari Powder","Haritaki Digestive","Bhringraj Hair Herbs"],
    "2": ["Brahmi Hair Oil","Bhringraj Oil","Dhanvantari Tailam","Ksheerabala Oil","Mahanarayan Oil","Sesame Cold Pressed","Bilva Ghee","Desi Cow Ghee","Mustard Oil","Coconut Oil"],
    "3": ["Kumkumadi Face Oil","Saffron Glow Cream","Aloe Vera Gel","Neem Face Pack","Multani Mitti Pack","Rose Water Toner","Ubtan Scrub","Sandalwood Paste","Turmeric Glow Serum"],
    "4": ["Bhringraj Shampoo","Amla Hair Mask","Onion Hair Oil","Hair Growth Serum","Henna Mehendi","Herbal Conditioner"],
    "5": ["Chyawanprash","Giloy Ghanvati","Tulsi Drops","Amla Juice","Immunity Kadha","Vitamin C Natural"],
    "6": ["Ajwain Capsules","Isabgol Husk","Triphala Churna","Ginger Honey Crystals","Buttermilk Masala","Hingvastak Churna"],
    "7": ["Sitopaladi Churna","Vasaka Leaves","Mulethi Sticks","Tulsi Cough Syrup","Pippali Rasayana"],
    "8": ["Boswellia Capsules","Turmeric Curcumin","Nirgundi Oil","Lakshadi Guggulu","Yoga Guggulu"],
    "9": ["Shatavari Kalp","Lohasava Iron Tonic","Kumari Asava","Shatavari Granules","Menstrual Health Tea"],
    "10": ["Shilajit Gold","Musli Pak","Ashwagandha Pro","Vitality Capsules","Testo Support Blend"],
    "11": ["Baby Massage Oil","Kids Immunity Drops","Baby Shampoo","Calcium Plus Kids","Kids Chyawanprash"],
    "12": ["Organic Turmeric","Ayurvedic Coffee Substitute","Moringa Powder","Triphala Tea","Herbal Green Tea"],
    "13": ["Herbal Soap","Drumstick Bath Powder","Activated Charcoal Soap","Herbal Hand Sanitizer","Neem Twigs Brush"],
    "14": ["Vicks Ayurvedic Balm","Herbal Inhaler","Nasal Drops","Eye Wash Triphala","Ear Drops Garlic Oil"]
  }';
  tags_pool TEXT[] := ARRAY['bestseller','new','organic','vegan','ayush','fssai','ayurvedic','natural','herbal','traditional','premium','eco-friendly','handmade','cold-pressed','raw'];
  suffixes TEXT[] := ARRAY['Plus','Pro','Gold','Max','Extra','Boost','Elite','Original'];
  cat_idx INT;
  cat_name TEXT;
  base_name TEXT;
  variant INT;
  prod_name TEXT;
  num_tags INT;
  tags TEXT[];
  j INT;
  price_val NUMERIC(10,2);
  rat NUMERIC(2,1);
  rev_cnt INT;
  stock_val INT;
  name_arr TEXT[];
BEGIN
  FOR i IN 0..499 LOOP
    cat_idx := (i % array_length(categories, 1)) + 1;
    cat_name := categories[cat_idx];
    name_arr := ARRAY(SELECT jsonb_array_elements_text((product_names->>cat_idx::text)::jsonb));
    base_name := name_arr[(i % array_length(name_arr, 1)) + 1];
    variant := i / array_length(name_arr, 1);
    IF variant = 0 THEN
      prod_name := base_name;
    ELSE
      prod_name := base_name || ' ' || suffixes[(variant % array_length(suffixes, 1)) + 1];
    END IF;

    num_tags := 1 + (i % 3);
    tags := ARRAY[]::TEXT[];
    FOR j IN 1..num_tags LOOP
      tags := array_append(tags, tags_pool[((i * j * 7) % array_length(tags_pool, 1)) + 1]);
    END LOOP;

    price_val := ROUND(((i * 37 % 4900) + 50)::numeric, 2);
    rat := ROUND((3.0 + (i * 13 % 20) / 10.0)::numeric, 1);
    rev_cnt := (i * 97) % 2000;
    stock_val := (i * 31) % 500;

    INSERT INTO products (id, name, description, category, price, currency, image_url, rating, review_count, stock, tags)
    VALUES (
      'prod_' || lpad(i::text, 5, '0'),
      prod_name,
      'Premium ' || lower(cat_name) || ' product crafted with traditional Ayurvedic ingredients for holistic wellness.',
      cat_name,
      price_val,
      'INR',
      'https://picsum.photos/seed/' || i || '/400/400',
      rat,
      rev_cnt,
      stock_val,
      tags
    );
  END LOOP;
END $$;

SELECT 'Seed complete! 100 doctors, slots, 500 products' as status;
