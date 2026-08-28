// Jest Setup

// Mock __DEV__ global
(globalThis as unknown as { __DEV__: boolean }).__DEV__ = true;

const cartItems = new Map<string, { product_id: string; quantity: number; unit_price: number; updated_at: string }>();
const wishlistItems = new Map<string, { product_id: string; added_at: string }>();

function executeSql(
  sql: string,
  params: unknown[] = [],
): unknown[] {
  const normalized = sql.trim().toLowerCase();

  if (normalized.startsWith('select * from cart_items')) {
    const items = Array.from(cartItems.values()).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    return items;
  }

  if (normalized.startsWith('select quantity from cart_items where product_id = ?')) {
    const productId = params[0] as string;
    const item = cartItems.get(productId);
    return item ? [{ quantity: item.quantity }] : [];
  }

  if (normalized.startsWith('select sum(quantity) as total from cart_items')) {
    const total = Array.from(cartItems.values()).reduce((sum, item) => sum + item.quantity, 0);
    return [{ total }];
  }

  if (normalized.startsWith('select * from wishlist_items')) {
    const items = Array.from(wishlistItems.values()).sort((a, b) => b.added_at.localeCompare(a.added_at));
    return items;
  }

  if (normalized.startsWith('select product_id from wishlist_items where product_id = ?')) {
    const productId = params[0] as string;
    const exists = wishlistItems.has(productId);
    return exists ? [{ product_id: productId }] : [];
  }

  return [];
}

function runSql(sql: string, params: unknown[] = []): Promise<{ rowsAffected: number }> {
  const normalized = sql.trim().toLowerCase();

  if (normalized.startsWith('insert into cart_items')) {
    const [productId, quantity, unitPrice, updatedAt] = params as [string, number, number, string];
    cartItems.set(productId, { product_id: productId, quantity, unit_price: unitPrice, updated_at: updatedAt });
    return Promise.resolve({ rowsAffected: 1 });
  }

  if (normalized.startsWith('update cart_items set quantity = ?, updated_at = ? where product_id = ?')) {
    const [quantity, updatedAt, productId] = params as [number, string, string];
    const existing = cartItems.get(productId);
    if (existing) {
      existing.quantity = quantity;
      existing.updated_at = updatedAt;
    }
    return Promise.resolve({ rowsAffected: 1 });
  }

  if (normalized.includes('on conflict(product_id) do update')) {
    const [productId, quantity, unitPrice, updatedAt] = params as [string, number, number, string];
    cartItems.set(productId, { product_id: productId, quantity, unit_price: unitPrice, updated_at: updatedAt });
    return Promise.resolve({ rowsAffected: 1 });
  }

  if (normalized.startsWith('delete from cart_items where product_id = ?')) {
    const productId = params[0] as string;
    cartItems.delete(productId);
    return Promise.resolve({ rowsAffected: 1 });
  }

  if (normalized.startsWith('delete from cart_items')) {
    cartItems.clear();
    return Promise.resolve({ rowsAffected: 1 });
  }

  if (normalized.startsWith('insert or ignore into wishlist_items')) {
    const [productId, addedAt] = params as [string, string];
    if (!wishlistItems.has(productId)) {
      wishlistItems.set(productId, { product_id: productId, added_at: addedAt });
    }
    return Promise.resolve({ rowsAffected: 1 });
  }

  if (normalized.startsWith('delete from wishlist_items where product_id = ?')) {
    const productId = params[0] as string;
    wishlistItems.delete(productId);
    return Promise.resolve({ rowsAffected: 1 });
  }

  if (normalized.startsWith('delete from wishlist_items')) {
    wishlistItems.clear();
    return Promise.resolve({ rowsAffected: 1 });
  }

  return Promise.resolve({ rowsAffected: 0 });
}

const mockDb = {
  execAsync: () => Promise.resolve(),
  getAllAsync: (sql: string, params?: unknown[]) => executeSql(sql, params),
  getFirstAsync: (sql: string, params?: unknown[]) => {
    const rows = executeSql(sql, params);
    return rows[0];
  },
  runAsync: (sql: string, params?: unknown[]) => runSql(sql, params),
  closeAsync: () => Promise.resolve(),
};

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() => Promise.resolve(mockDb)),
}));

// Mock Supabase client to avoid env var requirements in tests
jest.mock('./src/infrastructure/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      then: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
      signInWithOtp: jest.fn().mockResolvedValue({ data: {}, error: null }),
      verifyOtp: jest.fn().mockResolvedValue({ data: { session: null, user: null }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      updateUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  },
}));

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: unknown[]): void => {
  const message = args[0];
  if (typeof message === 'string' && message.includes('Warning:')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

console.warn = (...args: unknown[]): void => {
  const message = args[0];
  if (typeof message === 'string' && message.includes('Warning:')) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};
