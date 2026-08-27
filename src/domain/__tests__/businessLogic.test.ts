// Sample Business Logic Test

import { calculateCartTotal, validateBookingSlot } from '../businessLogic';

describe('calculateCartTotal', () => {
  it('calculates total for empty cart', () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it('calculates total for single item', () => {
    const items = [{ quantity: 2, unitPrice: 25.5 }];
    expect(calculateCartTotal(items)).toBe(51);
  });

  it('calculates total for multiple items', () => {
    const items = [
      { quantity: 1, unitPrice: 100 },
      { quantity: 3, unitPrice: 25 },
      { quantity: 2, unitPrice: 50 },
    ];
    expect(calculateCartTotal(items)).toBe(275);
  });
});

describe('validateBookingSlot', () => {
  it('rejects expired slots', () => {
    const pastSlot = {
      id: '1',
      startAt: new Date(Date.now() - 3600000).toISOString(),
      endAt: new Date(Date.now() - 1800000).toISOString(),
    };
    expect(validateBookingSlot(pastSlot)).toBe(false);
  });

  it('accepts future slots', () => {
    const futureSlot = {
      id: '1',
      startAt: new Date(Date.now() + 3600000).toISOString(),
      endAt: new Date(Date.now() + 5400000).toISOString(),
    };
    expect(validateBookingSlot(futureSlot)).toBe(true);
  });
});
