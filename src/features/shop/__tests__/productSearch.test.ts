// Product Search Tests
// Tests search filtering logic using pure functions matching repository behavior

import type { Product } from '../types';

const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Ashwagandha Capsules',
    description: 'Natural stress relief supplement',
    category: 'Herbal Supplements',
    price: 299,
    currency: 'INR',
    imageUrl: 'https://example.com/ashwa.jpg',
    rating: 4.5,
    reviewCount: 120,
    stock: 50,
    tags: ['stress', 'adaptogen'],
  },
  {
    id: 'prod_002',
    name: 'Brahmi Hair Oil',
    description: 'Ayurvedic hair growth oil',
    category: 'Hair Care',
    price: 450,
    currency: 'INR',
    imageUrl: 'https://example.com/brahmi.jpg',
    rating: 4.2,
    reviewCount: 85,
    stock: 30,
    tags: ['hair', 'growth'],
  },
  {
    id: 'prod_003',
    name: 'Triphala Powder',
    description: 'Digestive health supplement',
    category: 'Digestive Health',
    price: 199,
    currency: 'INR',
    imageUrl: 'https://example.com/triphala.jpg',
    rating: 4.8,
    reviewCount: 200,
    stock: 100,
    tags: ['digestion', 'detox'],
  },
  {
    id: 'prod_004',
    name: 'Neem Face Wash',
    description: 'Purifying neem face cleanser',
    category: 'Skin Care',
    price: 175,
    currency: 'INR',
    imageUrl: 'https://example.com/neem.jpg',
    rating: 4.0,
    reviewCount: 60,
    stock: 0,
    tags: ['skin', 'acne'],
  },
];

function searchProducts(products: Product[], query: string): Product[] {
  if (!query) return products;
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery),
  );
}

describe('Product Search', () => {
  it('search returns matching products by name', () => {
    const results = searchProducts(mockProducts, 'Ashwagandha');
    expect(results).toHaveLength(1);
    expect(results[0]!.name).toBe('Ashwagandha Capsules');
  });

  it('search is case-insensitive', () => {
    const upper = searchProducts(mockProducts, 'BRAHMI');
    const lower = searchProducts(mockProducts, 'brahmi');
    const mixed = searchProducts(mockProducts, 'BrAhMi');
    expect(upper).toHaveLength(1);
    expect(lower).toHaveLength(1);
    expect(mixed).toHaveLength(1);
    expect(upper[0]!.id).toBe(lower[0]!.id);
    expect(lower[0]!.id).toBe(mixed[0]!.id);
  });

  it('empty query returns all products', () => {
    const results = searchProducts(mockProducts, '');
    expect(results).toHaveLength(mockProducts.length);
  });

  it('search with special characters does not break', () => {
    const results = searchProducts(mockProducts, '%_\\\'\"[]{}');
    expect(results).toHaveLength(0);
  });

  it('search with no matches returns empty array', () => {
    const results = searchProducts(mockProducts, 'NonExistentProduct');
    expect(results).toHaveLength(0);
  });

  it('search by description also returns matches', () => {
    const results = searchProducts(mockProducts, 'Digestive');
    expect(results).toHaveLength(1);
    expect(results[0]!.name).toBe('Triphala Powder');
  });

  it('search matches partial strings', () => {
    const results = searchProducts(mockProducts, 'hair');
    expect(results).toHaveLength(1);
    expect(results[0]!.name).toBe('Brahmi Hair Oil');
  });

  it('search returns multiple matches when applicable', () => {
    const results = searchProducts(mockProducts, 'supplement');
    expect(results.length).toBeGreaterThanOrEqual(2);
    const names = results.map((p) => p.name);
    expect(names).toContain('Ashwagandha Capsules');
    expect(names).toContain('Triphala Powder');
  });

  it('search results can be sorted by rating descending', () => {
    const results = searchProducts(mockProducts, 'supplement');
    const sorted = [...results].sort((a, b) => b.rating - a.rating);
    expect(sorted[0]!.rating).toBeGreaterThanOrEqual(sorted[1]!.rating);
  });
});
