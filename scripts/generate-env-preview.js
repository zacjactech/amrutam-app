#!/usr/bin/env node
// Writes EXPO_PUBLIC_* from shell env vars into .env.preview
// Called during `pnpm install` (postinstall) so Metro can read them at bundle time.
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.preview');
const lines = [];
for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith('EXPO_PUBLIC_') && value) {
    lines.push(`${key}=${value}`);
  }
}
if (lines.length > 0) {
  fs.writeFileSync(envPath, lines.join('\n') + '\n');
  console.log(`Generated .env.preview with ${lines.length} EXPO_PUBLIC_* variables`);
} else {
  console.log('No EXPO_PUBLIC_* in shell env, skipping .env.preview generation');
}
