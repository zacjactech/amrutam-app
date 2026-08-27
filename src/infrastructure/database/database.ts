// SQLite Database Initialization

import * as SQLite from 'expo-sqlite';
import { logger } from '../logging/logger';

const DATABASE_NAME = 'amrutam.db';
const DATABASE_VERSION = 1;

const MIGRATIONS: string[] = [
  // Version 1: Initial schema
  `
  CREATE TABLE IF NOT EXISTS cart_items (
    product_id TEXT PRIMARY KEY,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_price REAL NOT NULL CHECK(unit_price >= 0),
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wishlist_items (
    product_id TEXT PRIMARY KEY,
    added_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    doctor_id TEXT NOT NULL,
    slot_id TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    sync_operation_id TEXT
  );

  CREATE TABLE IF NOT EXISTS sync_operations (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    payload TEXT NOT NULL,
    status TEXT NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    next_attempt_at TEXT,
    idempotency_key TEXT NOT NULL UNIQUE,
    last_error TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS health_records (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    occurred_at TEXT NOT NULL,
    tags TEXT NOT NULL,
    attachments TEXT NOT NULL,
    metadata TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_bookings_patient ON bookings(patient_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
  CREATE INDEX IF NOT EXISTS idx_sync_operations_status ON sync_operations(status);
  CREATE INDEX IF NOT EXISTS idx_health_records_patient ON health_records(patient_id);
  CREATE INDEX IF NOT EXISTS idx_health_records_type ON health_records(type);
  `,
];

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await runMigrations(dbInstance);
    logger.info('Database initialized', { name: DATABASE_NAME, version: DATABASE_VERSION });
    return dbInstance;
  } catch (error) {
    logger.error('Database initialization failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    for (const migration of MIGRATIONS) {
      await db.execAsync(migration);
    }
    logger.debug('Migrations completed', { count: MIGRATIONS.length });
  } catch (error) {
    logger.error('Migration failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
    logger.info('Database closed');
  }
}
