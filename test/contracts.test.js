import path from 'path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';

import { validateRepoContracts } from '../lib/contracts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

test('repo contract validation passes', () => {
  const issues = validateRepoContracts(repoRoot);
  assert.deepEqual(issues, []);
});
