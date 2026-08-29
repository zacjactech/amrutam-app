// Business Logic - Pure Functions

export interface CartItem {
  quantity: number;
  unitPrice: number;
}

export interface Slot {
  id: string;
  startAt: string;
  endAt: string;
}

/**
 * Calculate total price for cart items
 */
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
}

/**
 * Validate if a booking slot is still available (not expired)
 */
export function validateBookingSlot(slot: Slot, currentTime: Date = new Date()): boolean {
  const slotStart = new Date(slot.startAt);
  return slotStart > currentTime;
}

/**
 * Generate idempotency key for booking
 */
export function generateIdempotencyKey(patientId: string, slotId: string): string {
  return `${patientId}:${slotId}`;
}

/**
 * Calculate retry delay with exponential backoff and jitter
 */
export function calculateRetryDelay(attemptCount: number, baseDelayMs = 1000): number {
  const exponentialDelay = baseDelayMs * Math.pow(2, attemptCount);
  const jitter = Math.random() * 1000;
  return Math.min(exponentialDelay, 30000 - jitter);
}

/**
 * Check if error is retryable
 */
export function isRetryableError(errorCode: string): boolean {
  const retryableCodes = ['TIMEOUT', 'SERVER_ERROR', 'NETWORK_ERROR'];
  return retryableCodes.includes(errorCode);
}

/**
 * Group health records by month/year
 */
export function groupRecordsByMonth<T extends { occurredAt: string }>(
  records: T[],
): Record<string, T[]> {
  return records.reduce(
    (groups, record) => {
      const date = new Date(record.occurredAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key]!.push(record);
      return groups;
    },
    {} as Record<string, T[]>,
  );
}
