// Shop Module - Product Data Generator

import { Product, ProductCategory, SortOption, ProductFilter } from './types';
import { productSchema } from './schemas';

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  'Herbal Supplements',
  'Oils & Ghee',
  'Skin Care',
  'Hair Care',
  'Immunity',
  'Digestive Health',
  'Respiratory',
  'Joint Care',
  'Women\'s Wellness',
  'Men\'s Wellness',
  'Kids & Baby',
  'Food & Beverages',
  'Personal Care',
  'Home Remedies',
] as const;

const PRODUCT_NAMES: Record<ProductCategory, string[]> = {
  'Herbal Supplements': [
    'Ashwagandha Capsules', 'Triphala Tablets', 'Brahmi Memory Plus',
    'Tulsi Giloy Juice', 'Amla Immunity Boost', 'Shilajit Resin',
    'Moringa Leaf Powder', 'Neem Capsules', 'Guggulu Joint Support',
    'Shatavari Powder', 'Haritaki Digestive', 'Bhringraj Hair Herbs',
  ],
  'Oils & Ghee': [
    'Brahmi Hair Oil', 'Bhringraj Oil', 'Dhanvantari Tailam',
    'Ksheerabala Oil', 'Mahanarayan Oil', 'Sesame Cold Pressed',
    'Bilva Ghee', 'Desi Cow Ghee', 'Mustard Oil', 'Coconut Oil',
  ],
  'Skin Care': [
    'Kumkumadi Face Oil', 'Saffron Glow Cream', 'Aloe Vera Gel',
    'Neem Face Pack', 'Multani Mitti Pack', 'Rose Water Toner',
    'Ubtan Scrub', 'Sandalwood Paste', 'Turmeric Glow Serum',
  ],
  'Hair Care': [
    'Bhringraj Shampoo', 'Amla Hair Mask', 'Onion Hair Oil',
    'Hair Growth Serum', 'Henna Mehendi', 'Herbal Conditioner',
  ],
  'Immunity': [
    'Chyawanprash', 'Giloy Ghanvati', 'Tulsi Drops', 'Amla Juice',
    'Immunity Kadha', 'Vitamin C Natural',
  ],
  'Digestive Health': [
    'Ajwain Capsules', 'Isabgol Husk', 'Triphala Churna',
    'Ginger Honey Crystals', 'Buttermilk Masala', 'Hingvastak Churna',
  ],
  'Respiratory': [
    'Sitopaladi Churna', 'Vasaka Leaves', 'Mulethi Sticks',
    'Tulsi Cough Syrup', 'Pippali Rasayana',
  ],
  'Joint Care': [
    'Boswellia Capsules', 'Turmeric Curcumin', 'Nirgundi Oil',
    'Lakshadi Guggulu', 'Yoga Guggulu',
  ],
  'Women\'s Wellness': [
    'Shatavari Kalp', 'Lohasava Iron Tonic', 'Kumari Asava',
    'Shatavari Granules', 'Menstrual Health Tea',
  ],
  'Men\'s Wellness': [
    'Shilajit Gold', 'Musli Pak', 'Ashwagandha Pro',
    'Vitality Capsules', 'Testo Support Blend',
  ],
  'Kids & Baby': [
    'Baby Massage Oil', 'Kids Immunity Drops', 'Baby Shampoo',
    'Calcium Plus Kids', 'Kids Chyawanprash',
  ],
  'Food & Beverages': [
    'Organic Turmeric', 'Ayurvedic Coffee Substitute', 'Moringa Powder',
    'Triphala Tea', 'Herbal Green Tea',
  ],
  'Personal Care': [
    'Herbal Soap', 'Drumstick Bath Powder', 'Activated Charcoal Soap',
    'Herbal Hand Sanitizer', 'Neem Twigs Brush',
  ],
  'Home Remedies': [
    'Vicks Ayurvedic Balm', 'Herbal Inhaler', 'Nasal Drops',
    'Eye Wash Triphala', 'Ear Drops Garlic Oil',
  ],
};

const TAGS_POOL = [
  'bestseller', 'new', 'organic', 'vegan', 'ayush', 'fssai',
  'ayurvedic', 'natural', 'herbal', 'traditional', 'premium',
  'eco-friendly', 'handmade', 'cold-pressed', 'raw',
];

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

function generateProductName(category: ProductCategory, index: number): string {
  const names = PRODUCT_NAMES[category];
  const baseName = names[index % names.length]!;
  const variant = Math.floor(index / names.length);
  if (variant === 0) return baseName;
  const suffixes = ['Plus', 'Pro', 'Gold', 'Max', 'Extra', 'Boost', 'Elite', 'Original'];
  return `${baseName} ${suffixes[variant % suffixes.length]}`;
}

export function generateProduct(index: number): Product {
  const random = seededRandom(index + 1);
  const category = pickRandom(PRODUCT_CATEGORIES, random);
  const price = Math.round((random() * 4900 + 50) * 100) / 100;
  const rating = Math.round((3.0 + random() * 2.0) * 10) / 10;
  const reviewCount = Math.floor(random() * 2000);
  const stock = Math.floor(random() * 500);
  const numTags = 1 + Math.floor(random() * 3);
  const selectedTags: string[] = [];
  const availableTags = [...TAGS_POOL];
  for (let i = 0; i < numTags && availableTags.length > 0; i++) {
    const idx = Math.floor(random() * availableTags.length);
    selectedTags.push(availableTags[idx]!);
    availableTags.splice(idx, 1);
  }

  return {
    id: `prod_${index.toString().padStart(5, '0')}`,
    name: generateProductName(category, index),
    description: `Premium ${category.toLowerCase()} product crafted with traditional Ayurvedic ingredients for holistic wellness.`,
    category,
    price,
    currency: 'INR',
    imageUrl: `https://picsum.photos/seed/${index}/400/400`,
    rating,
    reviewCount,
    stock,
    tags: selectedTags,
  };
}

export function generateProducts(count: number): Product[] {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const product = generateProduct(i);
    products.push(productSchema.parse(product));
  }
  return products;
}

let productCache: Product[] | null = null;

export function getProductCache(): Product[] {
  if (productCache === null) {
    productCache = generateProducts(20000);
  }
  return productCache;
}

export function applyProductFilter(
  products: Product[],
  filter: ProductFilter,
): Product[] {
  return products.filter((product) => {
    if (filter.searchQuery.length > 0) {
      const query = filter.searchQuery.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(query);
      const descMatch = product.description.toLowerCase().includes(query);
      const tagMatch = product.tags.some((tag) => tag.toLowerCase().includes(query));
      if (!nameMatch && !descMatch && !tagMatch) {
        return false;
      }
    }

    if (filter.categories.length > 0 && !filter.categories.includes(product.category)) {
      return false;
    }

    if (filter.minPrice !== null && product.price < filter.minPrice) {
      return false;
    }

    if (filter.maxPrice !== null && product.price > filter.maxPrice) {
      return false;
    }

    if (filter.minRating !== null && product.rating < filter.minRating) {
      return false;
    }

    if (filter.inStockOnly && product.stock <= 0) {
      return false;
    }

    return true;
  });
}

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'popularity':
      sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      sorted.sort((a, b) => b.id.localeCompare(a.id));
      break;
  }
  return sorted;
}
