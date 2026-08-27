// Consultation Module - Doctor Data Generator

import { Doctor, ConsultationSlot, ConsultationType } from './types';
import { SPECIALIZATIONS, LANGUAGES } from './types';

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

const CLINIC_PREFIXES = [
  'Ayur', 'Pancha', 'Veda', 'Sattva', 'Prakruti', 'Dosha', 'Roga', 'Arogya',
  'Chikitsa', 'Sundar', 'Amrut', 'Divya', 'Swasth', 'Vaidya', 'Naturo',
];

const CLINIC_SUFFIXES = [
  'Clinic', 'Center', 'Wellness', 'Ayurveda', 'Panchakarma', 'Healing',
  'Therapeutics', 'Health Hub', 'Care', 'Center for Ayurveda',
];

const SPECIALIZATION_BIOS: Record<string, string[]> = {
  'General Ayurveda': [
    'Holistic Ayurvedic practitioner with expertise in preventive care and wellness.',
    'Specializes in traditional Ayurvedic treatments and lifestyle counseling.',
  ],
  'Panchakarma': [
    'Expert in detoxification and rejuvenation therapies through Panchakarma.',
    'Certified Panchakarma specialist with extensive clinical experience.',
  ],
  'Skin & Hair': [
    'Ayurvedic dermatologist focusing on natural skin and hair care solutions.',
    'Specializes in treating chronic skin conditions through Ayurveda.',
  ],
  'Digestive Health': [
    'Expert in managing digestive disorders through Ayurvedic principles.',
    'Specializes in gut health and metabolic balance.',
  ],
  'Mental Wellness': [
    'Integrative approach to mental health combining Ayurveda and modern psychology.',
    'Specializes in stress management and anxiety through Ayurvedic practices.',
  ],
  "Women's Health": [
    'Ayurvedic gynecologist with focus on women\'s reproductive health.',
    'Specializes in prenatal and postnatal Ayurvedic care.',
  ],
  'Child Care': [
    'Pediatric Ayurvedic specialist for children\'s health and development.',
    'Expert in Bal Chikitsa (Ayurvedic pediatrics).',
  ],
  'Joint & Spine': [
    'Specializes in musculoskeletal disorders and spinal health through Ayurveda.',
    'Expert in Marma therapy and joint care.',
  ],
  'Weight Management': [
    'Ayurvedic nutritionist focusing on sustainable weight management.',
    'Combines diet, herbs, and lifestyle for healthy weight loss.',
  ],
  'Respiratory Health': [
    'Specializes in respiratory conditions through Ayurvedic treatments.',
    'Expert in managing asthma and allergies naturally.',
  ],
};

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function pickRandom<T>(arr: readonly T[], random: () => number): T {
  return arr[Math.floor(random() * arr.length)] as T;
}

function generateDoctorId(index: number): string {
  return `doc_${index.toString().padStart(5, '0')}`;
}

function generateDoctorName(random: () => number): string {
  const firstName = pickRandom(FIRST_NAMES, random);
  const lastName = pickRandom(LAST_NAMES, random);
  const useDr = random() > 0.5;
  return useDr ? `Dr. ${firstName} ${lastName}` : `${firstName} ${lastName}`;
}

function generateClinicName(random: () => number): string {
  const prefix = pickRandom(CLINIC_PREFIXES, random);
  const suffix = pickRandom(CLINIC_SUFFIXES, random);
  return `${prefix} ${suffix}`;
}

function generateLanguages(random: () => number): string[] {
  const numLanguages = 1 + Math.floor(random() * 3);
  const selected: string[] = ['English'];
  const available = [...LANGUAGES].filter((l) => l !== 'English');

  for (let i = 0; i < numLanguages - 1 && available.length > 0; i++) {
    const idx = Math.floor(random() * available.length);
    selected.push(available[idx] as string);
    available.splice(idx, 1);
  }

  return selected;
}

function generateBio(specialization: string, random: () => number): string {
  const bios = SPECIALIZATION_BIOS[specialization];
  if (bios !== undefined && bios.length > 0) {
    return pickRandom(bios, random);
  }
  return 'Experienced Ayurvedic practitioner dedicated to holistic healing.';
}

export function generateDoctor(index: number): Doctor {
  const random = seededRandom(index + 1);
  const specialization = pickRandom(SPECIALIZATIONS, random);
  const experience = Math.floor(random() * 35) + 1;
  const rating = Math.round((3.0 + random() * 2.0) * 10) / 10;
  const reviewCount = Math.floor(random() * 500);
  const consultationFee = (Math.floor(random() * 20) + 2) * 50;
  const isAvailable = random() > 0.2;
  const slotDuration = [15, 20, 30, 45, 60][Math.floor(random() * 5)] ?? 30;

  return {
    id: generateDoctorId(index),
    name: generateDoctorName(random),
    photoUrl: `https://api.dicebear.com/7.x/person/svg?seed=${index}`,
    specialization,
    experience,
    rating,
    reviewCount,
    consultationFee,
    languages: generateLanguages(random),
    availability: {
      isAvailable,
      nextAvailableSlot: isAvailable ? generateNextSlotTime(random) : null,
      slotDuration,
    },
    bio: generateBio(specialization, random),
    clinicName: generateClinicName(random),
    clinicAddress: generateAddress(random),
  };
}

function generateNextSlotTime(random: () => number): string {
  const now = new Date();
  const hoursAhead = Math.floor(random() * 72) + 1;
  const slotTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);
  slotTime.setMinutes(0, 0, 0);
  return slotTime.toISOString();
}

function generateAddress(random: () => number): string {
  const streetNumbers = Math.floor(random() * 999) + 1;
  const areas = [
    'Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar',
    'JP Nagar', 'Marathahalli', 'Electronic City', 'Banashankari', 'BTM Layout',
  ];
  const area = pickRandom(areas, random);
  return `${streetNumbers}, ${area}, Bangalore`;
}

export function generateDoctors(count: number): Doctor[] {
  const doctors: Doctor[] = [];
  for (let i = 0; i < count; i++) {
    doctors.push(generateDoctor(i));
  }
  return doctors;
}

export function generateSlotsForDoctor(
  doctorId: string,
  daysAhead = 7,
): ConsultationSlot[] {
  const random = seededRandom(doctorId.charCodeAt(4) * 100 + doctorId.charCodeAt(5));
  const slots: ConsultationSlot[] = [];
  const types: ConsultationType[] = ['video', 'audio', 'chat', 'in-person'];
  const startHour = 9;
  const endHour = 18;

  for (let day = 0; day < daysAhead; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    date.setHours(0, 0, 0, 0);

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (random() > 0.7) continue;

        date.setHours(hour, min, 0, 0);
        const startTime = new Date(date);
        startTime.setMinutes(min);

        const duration = 30;
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

        slots.push({
          id: `slot_${doctorId}_${startTime.getTime()}`,
          doctorId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          isBooked: random() > 0.8,
          consultationType: pickRandom(types, random),
        });
      }
    }
  }

  return slots;
}
