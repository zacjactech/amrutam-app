// Shop Module - Wishlist Repository Test

import { wishlistRepository } from '../wishlistRepository';

describe('Wishlist Repository', () => {
  beforeEach(async () => {
    await wishlistRepository.clearAll();
  });

  it('should add items to wishlist', async () => {
    await wishlistRepository.addItem('prod_00001');
    const items = await wishlistRepository.getAllItems();
    expect(items).toHaveLength(1);
    expect(items[0]?.productId).toBe('prod_00001');
  });

  it('should not duplicate items', async () => {
    await wishlistRepository.addItem('prod_00001');
    await wishlistRepository.addItem('prod_00001');
    const items = await wishlistRepository.getAllItems();
    expect(items).toHaveLength(1);
  });

  it('should remove item from wishlist', async () => {
    await wishlistRepository.addItem('prod_00001');
    await wishlistRepository.removeItem('prod_00001');
    const items = await wishlistRepository.getAllItems();
    expect(items).toHaveLength(0);
  });

  it('should check if item is in wishlist', async () => {
    await wishlistRepository.addItem('prod_00001');
    expect(await wishlistRepository.isInWishlist('prod_00001')).toBe(true);
    expect(await wishlistRepository.isInWishlist('prod_00002')).toBe(false);
  });

  it('should clear all items', async () => {
    await wishlistRepository.addItem('prod_00001');
    await wishlistRepository.addItem('prod_00002');
    await wishlistRepository.clearAll();
    const items = await wishlistRepository.getAllItems();
    expect(items).toHaveLength(0);
  });
});
