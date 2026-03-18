#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { validateRepoContracts } from '../lib/contracts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const issues = validateRepoContracts(repoRoot);

if (issues.length > 0) {
  console.error('VentureOS contract validation failed:\n');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('VentureOS contract validation passed.');
