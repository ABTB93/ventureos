import fs from 'fs';
import os from 'os';
import path from 'path';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  copyDir,
  getIdeToolByLlm,
  isIdeLlm,
  parseSimpleYaml,
  resolveProviderKey,
} from '../lib/runtime.js';

test('parseSimpleYaml reads simple quoted values', () => {
  const parsed = parseSimpleYaml(`
# comment
user_name: "Founder"
region: North America
llm: claude-code
`);

  assert.equal(parsed.user_name, 'Founder');
  assert.equal(parsed.region, 'North America');
  assert.equal(parsed.llm, 'claude-code');
});

test('copyDir respects skipSet in nested directories', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ventureos-copydir-'));
  const srcDir = path.join(tmpRoot, 'src');
  const destDir = path.join(tmpRoot, 'dest');

  fs.mkdirSync(path.join(srcDir, 'nested'), { recursive: true });
  fs.writeFileSync(path.join(srcDir, 'keep.txt'), 'keep');
  fs.writeFileSync(path.join(srcDir, '.DS_Store'), 'junk');
  fs.writeFileSync(path.join(srcDir, 'nested', '.DS_Store'), 'nested-junk');
  fs.writeFileSync(path.join(srcDir, 'nested', 'keep.md'), 'nested');

  copyDir(srcDir, destDir, new Set(['.DS_Store']));

  assert.equal(fs.existsSync(path.join(destDir, 'keep.txt')), true);
  assert.equal(fs.existsSync(path.join(destDir, '.DS_Store')), false);
  assert.equal(fs.existsSync(path.join(destDir, 'nested', '.DS_Store')), false);
  assert.equal(fs.existsSync(path.join(destDir, 'nested', 'keep.md')), true);

  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

test('runtime helpers distinguish IDE configs from API configs', () => {
  assert.equal(isIdeLlm('claude-code'), true);
  assert.equal(isIdeLlm('openai'), false);
  assert.equal(resolveProviderKey('openai'), 'openai');
  assert.equal(resolveProviderKey('cursor'), null);
  assert.equal(getIdeToolByLlm('claude-code')?.id, 'claude');
});
