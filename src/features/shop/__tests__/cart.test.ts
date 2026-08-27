// Shop Module - Cart Persistence Test

import { cartRepository } from '../cartRepository';

describe('Cart Repository', () => {
  beforeEach(async () => {
    await cartRepository.clearAll();
  });

  it('should add items to cart', async () => {
    const item = await cartRepository.addItem('prod_00001', 299);
    expect(item.productId).toBe('prod_00001');
    expect(item.quantity).toBe(1);
    expect(item.unitPrice).toBe(299);
  });

  it('should increment quantity for duplicate items', async () => {
    await cartRepository.addItem('prod_00001', 299);
    const item = await cartRepository.addItem('prod_00001', 299);
    expect(item.quantity).toBe(2);
  });

  it('should update quantity', async () => {
    await cartRepository.addItem('prod_00001', 299);
    await cartRepository.updateQuantity('prod_00001', 5);
    const items = await cartRepository.getAllItems();
    expect(items[0]?.quantity).toBe(5);
  });

  it('should remove item when quantity is zero', async () => {
    await cartRepository.addItem('prod_00001', 299);
    await cartRepository.updateQuantity('prod_00001', 0);
    const items = await cartRepository.getAllItems();
    expect(items).toHaveLength(0);
  });

  it('should remove item', async () => {
    await cartRepository.addItem('prod_00001', 299);
    await cartRepository.removeItem('prod_00001');
    const items = await cartRepository.getAllItems();
    expect(items).toHaveLength(0);
  });

  it('should clear all items', async () => {
    await cartRepository.addItem('prod_00001', 299);
    await cartRepository.addItem('prod_00002', 499);
    await cartRepository.clearAll();
    const items = await cartRepository.getAllItems();
    expect(items).toHaveLength(0);
  });

  it('should calculate total items', async () => {
    await cartRepository.addItem('prod_00001', 299);
    await cartRepository.addItem('prod_00001', 299);
    await cartRepository.addItem('prod_00002', 499);
    const total = await cartRepository.getTotalItems();
    expect(total).toBe(3);
  });
});
