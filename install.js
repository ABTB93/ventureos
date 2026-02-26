#!/usr/bin/env node
/**
 * VentureOS CLI
 * Usage:
 *   npx ventureos           — setup wizard + start (auto-detects your environment)
 *   npx ventureos update    — update framework files, keep all your work
 *   npx ventureos config    — update your configuration
 *   npx ventureos start     — launch Victor chat (if already installed)
 *
 * Zero npm dependencies — pure Node.js (readline/promises, fs, path, url, fetch)
 * Requires Node.js >= 18.0.0
 */

import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync, spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const PACKAGE_ROOT = path.dirname(__filename);

let _spinner;

// ─── Providers ─────────────────────────────────────────────────────────────────

const PROVIDERS = {
  anthropic: {
    label:        'Claude (Anthropic)',
    envVar:       'ANTHROPIC_API_KEY',
    defaultModel: 'claude-opus-4-6',
    keyUrl:       'https://console.anthropic.com',
  },
  openai: {
    label:        'ChatGPT (OpenAI)',
    envVar:       'OPENAI_API_KEY',
    defaultModel: 'gpt-4o',
    keyUrl:       'https://platform.openai.com/api-keys',
  },
  gemini: {
    label:        'Gemini (Google)',
    envVar:       'GOOGLE_API_KEY',
    defaultModel: 'gemini-2.0-flash',
    keyUrl:       'https://aistudio.google.com/app/apikey',
  },
};

// ─── Known AI IDEs ─────────────────────────────────────────────────────────────

const IDE_TOOLS = [
  {
    id:          'cursor',
    label:       'Cursor',
    description: 'no API key needed',
    cmds:        ['cursor'],
    appPaths:    ['/Applications/Cursor.app'],
    instructions: (dir) => [
      '  1.  Open this folder in Cursor',
      `      cursor "${dir}"`,
      '      (or: File → Open Folder → select this folder)',
      '',
      '  2.  In the Cursor chat panel, type exactly this:',
      '      @ventureOS/venture-master.md',
      '',
      '  3.  Victor — your AI co-founder — will take it from there.',
      '',
      '  No API key. No extra setup. Just open and chat.',
    ],
  },
  {
    id:          'windsurf',
    label:       'Windsurf',
    description: 'no API key needed',
    cmds:        ['windsurf'],
    appPaths:    ['/Applications/Windsurf.app'],
    instructions: (dir) => [
      '  1.  Open this folder in Windsurf',
      `      windsurf "${dir}"`,
      '      (or: File → Open Folder → select this folder)',
      '',
      '  2.  In the Windsurf chat panel, type:',
      '      @ventureOS/venture-master.md',
      '',
      '  3.  Victor — your AI co-founder — will take it from there.',
      '',
      '  No API key. No extra setup. Just open and chat.',
    ],
  },
  {
    id:          'claude',
    label:       'Claude Code',
    description: 'no API key needed',
    cmds:        ['claude'],
    appPaths:    [],
    instructions: (dir) => [
      '  1.  Open this folder in your terminal and start Claude Code',
      `      cd "${dir}"`,
      '      claude',
      '',
      '  2.  Type this to activate VentureOS:',
      '      @ventureOS/venture-master.md',
      '',
      '  3.  Victor — your AI co-founder — will take it from there.',
      '',
      '  Full markdown rendering, streaming, all native Claude Code features.',
    ],
  },
  {
    id:          'antigravity',
    label:       'Antigravity',
    description: 'free, no API key needed',
    cmds:        ['antigravity'],
    appPaths:    ['/Applications/Antigravity.app'],
    instructions: (dir) => [
      '  1.  Open this folder in Antigravity',
      `      antigravity "${dir}"`,
      '      (or: File → Open Folder → select this folder)',
      '',
      '  2.  In the chat panel, type:',
      '      @ventureOS/venture-master.md',
      '',
      '  3.  Victor — your AI co-founder — will take it from there.',
      '',
      '  Free to use. Supports Gemini, Claude, and more.',
    ],
  },
];

// ─── Constants (must be before entry point) ────────────────────────────────────

// Files skipped when doing a fresh install (copyDir to ventureOS/)
const SKIP = new Set([
  'install.js', 'package.json', 'package-lock.json',
  '.gitignore', 'config.yaml', 'node_modules', '.git', '.DS_Store',
]);

// Files/folders that belong to the user — never overwritten on update
const USER_DATA = new Set([
  'config.yaml', '_memory', 'node_modules', '.git', '.gitignore', '.DS_Store',
  'package.json', 'package-lock.json',
]);

// ─── Entry point ───────────────────────────────────────────────────────────────

const cmd = process.argv[2];

if (cmd === 'start') {
  legacyStart().catch(handleFatalError);
} else if (cmd === 'config') {
  reconfigure().catch(handleFatalError);
} else if (cmd === 'update') {
  update().catch(handleFatalError);
} else {
  main().catch(handleFatalError);
}

function handleFatalError(err) {
  if (err.code !== 'ERR_USE_AFTER_CLOSE') {
    console.error('\n  Error:', err.message, '\n');
    process.exit(1);
  }
}

// ─── Utilities ─────────────────────────────────────────────────────────────────

function line() { return '  ' + '─'.repeat(52); }

function parseSimpleYaml(text) {
  const result = {};
  for (const rawLine of text.split('\n')) {
    const l = rawLine.trim();
    if (!l || l.startsWith('#')) continue;
    const colonIdx = l.indexOf(':');
    if (colonIdx === -1) continue;
    const key = l.slice(0, colonIdx).trim();
    let value = l.slice(colonIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

function showBanner() {
  console.log('\n');
  console.log('  ┌' + '─'.repeat(52) + '┐');
  console.log('  │                                                    │');
  console.log('  │   VentureOS                                        │');
  console.log('  │   AI-Powered Venture Building Framework            │');
  console.log('  │                                                    │');
  console.log('  │   Build your startup — step by step.              │');
  console.log('  │                                                    │');
  console.log('  └' + '─'.repeat(52) + '┘');
  console.log('\n');
}

// ─── IDE Detection ─────────────────────────────────────────────────────────────

function detectIDEs() {
  const found = [];
  for (const ide of IDE_TOOLS) {
    const byCLI = ide.cmds.some(c => {
      try {
        const r = spawnSync('which', [c], { encoding: 'utf8', stdio: 'pipe' });
        return r.status === 0 && r.stdout.trim();
      } catch { return false; }
    });
    const byApp = ide.appPaths.some(p => {
      try { return fs.existsSync(p); } catch { return false; }
    });
    if (byCLI || byApp) found.push(ide);
  }
  return found;
}

// ─── File helpers ───────────────────────────────────────────────────────────────

function copyDir(src, dest, skipSet = new Set()) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    if (skipSet.has(entry)) continue;
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function generateConfig({ userName, researchDepth, llm, defaultMode }) {
  return `# VentureOS Configuration
# Edit this file anytime to update your settings.
# ─────────────────────────────────────────

# Your name — used by agents to address you
user_name: "${userName}"

# Active venture name — leave blank to start a new venture
venture_name: ""

# Where venture outputs are saved (relative to project root)
output_folder: "_ventures"

# Research depth for domain and market research agents
# light    = high-level overview, fast
# standard = structured analysis with sourced data (recommended)
# deep     = exhaustive multi-source research with cross-validation
research_depth: "${researchDepth}"

# Your AI tool or provider
# IDE users: claude-code | cursor | windsurf | other
# API users: anthropic | openai | gemini
llm: "${llm}"

# Execution mode for workflows
# guided    = agent pauses at each checkpoint for review and approval (recommended)
# yolo      = agent runs the full workflow autonomously and presents all outputs at the end
# autopilot = Victor runs all phases in sequence, decides at every gate, produces a full venture-scan-report
default_mode: "${defaultMode}"
`;
}

function installFiles(targetDir, ventureOSDir, configYaml) {
  copyDir(PACKAGE_ROOT, ventureOSDir, SKIP);
  console.log('  ✓  Framework files installed   →  ventureOS/');

  fs.writeFileSync(path.join(ventureOSDir, 'config.yaml'), configYaml, 'utf8');
  console.log('  ✓  Configuration saved         →  ventureOS/config.yaml');

  const venturesDir = path.join(targetDir, '_ventures');
  if (!fs.existsSync(venturesDir)) {
    fs.mkdirSync(venturesDir, { recursive: true });
    fs.writeFileSync(path.join(venturesDir, '.gitkeep'), '', 'utf8');
  }
  console.log('  ✓  Output folder ready         →  _ventures/');

  const gitignorePath = path.join(targetDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, '# VentureOS\n_ventures/\nnode_modules/\n.DS_Store\n', 'utf8');
    console.log('  ✓  .gitignore created');
  }
}

// ─── Setup Wizard ──────────────────────────────────────────────────────────────

async function runSetupWizard(rl, { forIDE = false } = {}) {
  console.log('\n' + line());
  console.log('  A few quick questions so Victor knows how to help you.');
  console.log(line() + '\n');

  const nameInput = await rl.question('  Your name (press Enter for "Founder"): ');
  const userName = nameInput.trim() || 'Founder';

  console.log('\n  How thorough should VentureOS be with research?\n');
  console.log('     1.  Standard  — structured analysis with sourced data  (recommended)');
  console.log('     2.  Light     — quick overview, faster');
  console.log('     3.  Deep      — exhaustive, multi-source\n');
  const depthInput = await rl.question('     Select [1-3]: ');
  const researchDepth = ({ '1': 'standard', '2': 'light', '3': 'deep' })[depthInput.trim()] ?? 'standard';

  console.log('\n  How should workflows run by default?\n');
  console.log('     1.  Guided  — pauses so you review each step  (recommended)');
  console.log('     2.  Yolo    — runs everything on its own\n');
  const modeInput = await rl.question('     Select [1-2]: ');
  const defaultMode = modeInput.trim() === '2' ? 'yolo' : 'guided';

  let llm = 'anthropic';
  if (!forIDE) {
    console.log('\n  Which AI service will you use?\n');
    console.log('     1.  Claude (Anthropic)  (recommended)');
    console.log('     2.  ChatGPT (OpenAI)');
    console.log('     3.  Gemini (Google)\n');
    const llmInput = await rl.question('     Select [1-3]: ');
    llm = ({ '1': 'anthropic', '2': 'openai', '3': 'gemini' })[llmInput.trim()] ?? 'anthropic';
  }

  return { userName, researchDepth, llm, defaultMode };
}

// ─── API Key Recovery ──────────────────────────────────────────────────────────

/**
 * Prompts for an API key with a recovery menu.
 * Returns the key string, or null if the user wants to switch provider.
 * Exits the process if user picks "show free tools" or "exit".
 */
async function promptForAPIKey(rl, providerKey) {
  const provider = PROVIDERS[providerKey];

  while (true) {
    console.log(`\n  No ${provider.envVar} found.\n`);
    console.log('     1.  I\'ll paste my key now');
    console.log(`     2.  How to get a key  →  ${provider.keyUrl}`);
    console.log('     3.  Switch to a different AI service');
    console.log('     4.  Use an AI IDE instead — no key needed');
    console.log('     5.  Exit\n');

    const choice = (await rl.question('     Select [1-5]: ')).trim();

    if (choice === '1') {
      const key = (await rl.question(`\n     Paste your ${provider.label} API key: `)).trim();
      if (key) {
        console.log(`\n  Tip: save this to skip the prompt next time:`);
        console.log(`       export ${provider.envVar}=your-key\n`);
        return key;
      }
      console.log('\n  No key entered.\n');
      continue;
    }

    if (choice === '2') {
      console.log(`\n  Open this link to get your key:\n  ${provider.keyUrl}\n`);
      console.log('  Come back and run  npx ventureos  once you have it.\n');
      rl.close();
      process.exit(0);
    }

    if (choice === '3') return null; // signal: switch provider

    if (choice === '4') {
      showFreeToolsHelp();
      rl.close();
      process.exit(0);
    }

    if (choice === '5') {
      rl.close();
      process.exit(0);
    }
  }
}

/**
 * Asks user to pick a provider, then prompts for its API key.
 * Loops until a valid provider + key is chosen.
 */
async function selectProviderAndKey(rl) {
  while (true) {
    console.log('\n  Which AI service do you have a key for?\n');
    console.log('     1.  Claude (Anthropic)  (recommended)');
    console.log('     2.  ChatGPT (OpenAI)');
    console.log('     3.  Gemini (Google)');
    console.log('     4.  I don\'t have one yet — show me free options\n');

    const choice = (await rl.question('     Select [1-4]: ')).trim();

    if (choice === '4') {
      showFreeToolsHelp();
      rl.close();
      process.exit(0);
    }

    const providerKey = ({ '1': 'anthropic', '2': 'openai', '3': 'gemini' })[choice] ?? 'anthropic';
    const apiKey = await promptForAPIKey(rl, providerKey);
    if (apiKey) return { providerKey, apiKey };
    // null = user wants to switch provider — loop again
  }
}

function showFreeToolsHelp() {
  console.log('\n' + line());
  console.log('  AI tools you can use for free — no API key needed:\n');
  console.log('  Antigravity  (Google)  — free preview, Gemini + Claude + more');
  console.log('  → https://antigravity.google\n');
  console.log('  Cursor       — popular AI code editor');
  console.log('  → https://cursor.com\n');
  console.log('  Windsurf     — AI IDE by Codeium');
  console.log('  → https://windsurf.com\n');
  console.log('  Once installed, run  npx ventureos  again and we\'ll detect it.');
  console.log(line() + '\n');
}

// ─── Main Flow ─────────────────────────────────────────────────────────────────

async function main() {
  showBanner();

  const projectRoot = process.cwd();
  const ventureOSDir = path.join(projectRoot, 'ventureOS');
  const configPath = path.join(ventureOSDir, 'config.yaml');
  const rl = readline.createInterface({ input, output });

  try {
    // ── Already installed ──────────────────────────────────────────────────
    if (fs.existsSync(configPath)) {
      const config = parseSimpleYaml(fs.readFileSync(configPath, 'utf8'));
      console.log(`  Welcome back, ${config.user_name || 'Founder'}!\n`);
      console.log('  VentureOS is already set up in this folder.');
      console.log('  To get the latest framework:   npx ventureos update');
      console.log('  To update your settings:       npx ventureos config\n');
      await launchChat(rl, projectRoot, config);
      return;
    }

    // ── Environment scan ───────────────────────────────────────────────────
    console.log('  Scanning your environment...\n');
    const detectedIDEs = detectIDEs();

    if (detectedIDEs.length > 0) {
      detectedIDEs.forEach(ide => {
        console.log(`  ✓  ${ide.label} detected   — ${ide.description}`);
      });
      console.log('');
    } else {
      console.log('  No AI tools found on this computer.\n');
    }

    // ── Route ──────────────────────────────────────────────────────────────
    let chosenIDE = null;

    if (detectedIDEs.length === 1) {
      const ide = detectedIDEs[0];
      console.log(`  Good news: ${ide.label} comes with AI built in — ${ide.description}.\n`);
      const ans = (await rl.question(`  Set up VentureOS for ${ide.label}? (Y/n): `)).trim().toLowerCase();
      if (!ans || ans === 'y' || ans === 'yes') {
        chosenIDE = ide;
      } else {
        // User declined IDE — fall through to API key path
        const { providerKey, apiKey } = await selectProviderAndKey(rl);
        await installAndChat(rl, projectRoot, ventureOSDir, configPath, { forIDE: false, providerKey, apiKey });
        return;
      }
    } else if (detectedIDEs.length > 1) {
      console.log('  Which would you like to use?\n');
      detectedIDEs.forEach((ide, i) => {
        const tag = i === 0 ? '   ← recommended' : '';
        console.log(`     ${i + 1}.  ${ide.label}   — ${ide.description}${tag}`);
      });
      console.log(`     ${detectedIDEs.length + 1}.  I'd rather use my own API key\n`);
      const idx = parseInt((await rl.question('     Select: ')).trim(), 10) - 1;
      if (idx >= 0 && idx < detectedIDEs.length) {
        chosenIDE = detectedIDEs[idx];
      } else {
        const { providerKey, apiKey } = await selectProviderAndKey(rl);
        await installAndChat(rl, projectRoot, ventureOSDir, configPath, { forIDE: false, providerKey, apiKey });
        return;
      }
    } else {
      // Nothing detected
      console.log('  How would you like to run VentureOS?\n');
      console.log('     1.  I have an API key  (OpenAI, Claude, or Gemini)');
      console.log('     2.  Show me free options — no key needed\n');
      const choice = (await rl.question('     Select [1-2]: ')).trim();
      if (choice === '2') {
        showFreeToolsHelp();
        rl.close();
        return;
      }
      const { providerKey, apiKey } = await selectProviderAndKey(rl);
      await installAndChat(rl, projectRoot, ventureOSDir, configPath, { forIDE: false, providerKey, apiKey });
      return;
    }

    // ── IDE setup ──────────────────────────────────────────────────────────
    const { userName, researchDepth, defaultMode } = await runSetupWizard(rl, { forIDE: true });
    rl.close();

    console.log('\n' + line());
    console.log('  Installing...');
    console.log(line() + '\n');

    const ideLlm = chosenIDE.id === 'claude' ? 'claude-code' : (['cursor', 'windsurf'].includes(chosenIDE.id) ? chosenIDE.id : 'other');
    const configYaml = generateConfig({ userName, researchDepth, llm: ideLlm, defaultMode });
    installFiles(projectRoot, ventureOSDir, configYaml);

    console.log('\n' + line());
    console.log('  VentureOS is ready!');
    console.log(line() + '\n');
    console.log("  Here's how to start:\n");
    chosenIDE.instructions(projectRoot).forEach(l => console.log(l));
    console.log('\n' + line() + '\n');

  } catch (err) {
    rl.close();
    if (err.code === 'ERR_USE_AFTER_CLOSE') return;
    throw err;
  }
}

async function installAndChat(rl, projectRoot, ventureOSDir, configPath, { forIDE, providerKey, apiKey }) {
  const { userName, researchDepth, llm, defaultMode } = await runSetupWizard(rl, { forIDE });

  console.log('\n' + line());
  console.log('  Installing...');
  console.log(line() + '\n');

  const configYaml = generateConfig({ userName, researchDepth, llm, defaultMode });
  installFiles(projectRoot, ventureOSDir, configYaml);

  console.log('\n' + line());
  console.log('  All set! Starting Victor...');
  console.log(line() + '\n');

  const config = parseSimpleYaml(configYaml);
  await launchChat(rl, projectRoot, config, { providerKey, apiKey });
}

// ─── Reconfigure ───────────────────────────────────────────────────────────────

async function reconfigure() {
  showBanner();

  const projectRoot = process.cwd();
  const configPath = path.join(projectRoot, 'ventureOS', 'config.yaml');

  if (!fs.existsSync(configPath)) {
    console.error('  VentureOS is not set up here. Run: npx ventureos\n');
    process.exit(1);
  }

  const current = parseSimpleYaml(fs.readFileSync(configPath, 'utf8'));
  console.log('  Current settings:\n');
  console.log(`     Name:     ${current.user_name     || '—'}`);
  console.log(`     Research: ${current.research_depth || '—'}`);
  console.log(`     Mode:     ${current.default_mode  || '—'}`);
  console.log(`     Provider: ${current.llm           || '—'}\n`);

  const rl = readline.createInterface({ input, output });
  try {
    const { userName, researchDepth, llm, defaultMode } = await runSetupWizard(rl, { forIDE: false });
    rl.close();
    const newConfig = generateConfig({ userName, researchDepth, llm, defaultMode });
    fs.writeFileSync(configPath, newConfig, 'utf8');
    console.log('\n  ✓  Configuration updated  →  ventureOS/config.yaml\n');
  } catch (err) {
    rl.close();
    if (err.code === 'ERR_USE_AFTER_CLOSE') return;
    throw err;
  }
}

// ─── Update ────────────────────────────────────────────────────────────────────

async function update() {
  showBanner();

  const projectRoot = process.cwd();
  const ventureOSDir = path.join(projectRoot, 'ventureOS');
  const configPath = path.join(ventureOSDir, 'config.yaml');

  if (!fs.existsSync(configPath)) {
    console.error('  VentureOS is not set up here. Run: npx ventureos\n');
    process.exit(1);
  }

  // Read current version from the installed package.json for display
  const pkgPath = path.join(PACKAGE_ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  console.log(`  Updating to VentureOS v${pkg.version}...\n`);
  console.log('  Your work is safe — these are never touched:\n');
  console.log('    ✓  ventureOS/config.yaml        (your values — comments refreshed)');
  console.log('    ✓  ventureOS/_memory/            (your venture state)');
  console.log('    ✓  _ventures/                    (all your documents)\n');
  console.log(line());
  console.log('  Updating framework files...');
  console.log(line() + '\n');

  copyDir(PACKAGE_ROOT, ventureOSDir, USER_DATA);

  console.log('  ✓  venture-master.md updated');
  console.log('  ✓  agents/ updated');
  console.log('  ✓  workflows/ updated');
  console.log('  ✓  templates/ updated');
  console.log('  ✓  techniques/ updated');
  console.log('  ✓  scoring/ updated');

  // Refresh config.yaml comments/template while preserving user values
  const existingConfig = parseSimpleYaml(fs.readFileSync(configPath, 'utf8'));
  const refreshedConfig = generateConfig({
    userName:      existingConfig.user_name      || '',
    researchDepth: existingConfig.research_depth || 'standard',
    llm:           existingConfig.llm            || 'claude-code',
    defaultMode:   existingConfig.default_mode   || 'guided',
  });
  fs.writeFileSync(configPath, refreshedConfig, 'utf8');
  console.log('  ✓  config.yaml comments refreshed  (your values preserved)');

  console.log('\n' + line());
  console.log(`  VentureOS is up to date!  (v${pkg.version})`);
  console.log(line() + '\n');
  console.log('  Your venture state and all documents are unchanged.');
  console.log('  Run  npx ventureos  to continue where you left off.\n');
}

// ─── Legacy start command ───────────────────────────────────────────────────────

async function legacyStart() {
  showBanner();
  const projectRoot = process.cwd();
  const configPath = path.join(projectRoot, 'ventureOS', 'config.yaml');
  if (!fs.existsSync(configPath)) {
    console.error('  VentureOS is not set up here. Run: npx ventureos\n');
    process.exit(1);
  }
  const config = parseSimpleYaml(fs.readFileSync(configPath, 'utf8'));
  const rl = readline.createInterface({ input, output });
  try {
    await launchChat(rl, projectRoot, config);
  } finally {
    rl.close();
  }
}

// ─── Chat ───────────────────────────────────────────────────────────────────────

async function launchChat(rl, projectRoot, config, credentials = null) {
  const providerKey = credentials?.providerKey || (PROVIDERS[config.llm] ? config.llm : 'anthropic');
  const provider = PROVIDERS[providerKey];

  // ── Resolve API key ────────────────────────────────────────────────────────
  let apiKey = credentials?.apiKey || process.env[provider.envVar];

  if (!apiKey) {
    apiKey = await promptForAPIKey(rl, providerKey);
    if (!apiKey) {
      // user wants to switch provider — tell them to reconfigure
      console.log('\n  Run  npx ventureos config  to change your AI provider.\n');
      rl.close();
      process.exit(0);
    }
  }

  // ── Build system prompt ────────────────────────────────────────────────────
  const masterPath = path.join(projectRoot, 'ventureOS', 'venture-master.md');
  const systemPrompt = fs.readFileSync(masterPath, 'utf8')
    .replace(/\{project-root\}/g,          projectRoot)
    .replace(/\{communication_language\}/g, 'English')
    .replace(/\{user_name\}/g,             config.user_name      || 'Founder')
    .replace(/\{llm\}/g,                   config.llm            || 'anthropic')
    .replace(/\{research_depth\}/g,        config.research_depth || 'standard')
    .replace(/\{default_mode\}/g,          config.default_mode   || 'guided')
    .replace(/\{output_folder\}/g,         config.output_folder  || '_ventures');

  const configContent  = fs.readFileSync(path.join(projectRoot, 'ventureOS', 'config.yaml'), 'utf8');
  const statePath      = path.join(projectRoot, 'ventureOS', '_memory', 'venture-state.yaml');
  const stateContent   = fs.existsSync(statePath)
    ? fs.readFileSync(statePath, 'utf8')
    : 'No venture state yet — this is a fresh start.';

  const activationMsg =
    `Activate.\n\n` +
    `--- ventureOS/config.yaml ---\n${configContent}\n\n` +
    `--- ventureOS/_memory/venture-state.yaml ---\n${stateContent}`;

  console.log(line());
  console.log(`  Connected to ${provider.label}`);
  console.log('  Type your message and press Enter.  Type "exit" to quit.');
  console.log(line() + '\n');

  const messages = [];

  // ── Activation call ────────────────────────────────────────────────────────
  showSpinner('  Victor is thinking');
  let firstResponse;
  try {
    firstResponse = await callLLM(providerKey, apiKey, provider.defaultModel, systemPrompt, [
      { role: 'user', content: activationMsg },
    ]);
  } catch (err) {
    stopSpinner();
    await handleConnectionError(rl, err, providerKey, projectRoot, config);
    return;
  }
  stopSpinner();

  console.log('\n' + indentText(firstResponse) + '\n');
  messages.push({ role: 'user', content: activationMsg });
  messages.push({ role: 'assistant', content: firstResponse });
  await autoLoadAgents(firstResponse, messages, projectRoot);

  // ── Chat loop ──────────────────────────────────────────────────────────────
  while (true) {
    let userInput;
    try { userInput = await rl.question('  You: '); }
    catch { break; }

    const trimmed = userInput.trim();
    if (!trimmed) continue;
    if (['exit', 'quit', 'da', '/exit'].includes(trimmed.toLowerCase())) {
      console.log('\n  Victor: Safe travels. Your venture state has been saved.\n');
      break;
    }

    messages.push({ role: 'user', content: trimmed });
    showSpinner('  Victor is thinking');

    let response;
    try {
      response = await callLLM(providerKey, apiKey, provider.defaultModel, systemPrompt, messages);
    } catch (err) {
      stopSpinner();
      console.error(`\n  ❌ ${err.message}\n`);
      messages.pop();
      continue; // stay in the loop — user can retry
    }
    stopSpinner();

    console.log('\n' + indentText(response) + '\n');
    messages.push({ role: 'assistant', content: response });
    await autoLoadAgents(response, messages, projectRoot);
  }
}

async function handleConnectionError(rl, err, providerKey, projectRoot, config) {
  const provider = PROVIDERS[providerKey];
  console.error(`\n  ❌ Could not connect to ${provider.label}`);
  console.error(`     ${err.message}\n`);

  console.log('  What would you like to do?\n');
  console.log('     1.  Try a different API key');
  console.log(`     2.  Get a new key  →  ${provider.keyUrl}`);
  console.log('     3.  Exit\n');

  const choice = (await rl.question('     Select [1-3]: ')).trim();

  if (choice === '1') {
    const key = (await rl.question(`\n     Paste your ${provider.label} API key: `)).trim();
    if (key) {
      await launchChat(rl, projectRoot, config, { providerKey, apiKey: key });
      return;
    }
  } else if (choice === '2') {
    console.log(`\n  Open:  ${provider.keyUrl}`);
    console.log('  Then run  npx ventureos  again.\n');
  }

  rl.close();
  process.exit(0);
}

// ─── Spinner ────────────────────────────────────────────────────────────────────

function showSpinner(msg) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  process.stdout.write('\n');
  _spinner = setInterval(() => {
    process.stdout.write(`\r  ${frames[i++ % frames.length]}  ${msg}...`);
  }, 80);
}

function stopSpinner() {
  clearInterval(_spinner);
  process.stdout.write('\r' + ' '.repeat(60) + '\r');
}

// ─── Agent auto-loading ────────────────────────────────────────────────────────

async function autoLoadAgents(response, messages, projectRoot) {
  const pattern = /ventureOS\/agents\/([\w-]+\.md)/g;
  const files = [...new Set([...response.matchAll(pattern)].map(m => m[1]))];
  for (const filename of files) {
    const alreadyLoaded = messages.some(
      m => m.role === 'user' && m.content.includes(`ventureOS/agents/${filename}`)
    );
    if (alreadyLoaded) continue;
    const agentPath = path.join(projectRoot, 'ventureOS', 'agents', filename);
    if (!fs.existsSync(agentPath)) continue;
    const content = fs.readFileSync(agentPath, 'utf8');
    messages.push({
      role: 'user',
      content: `Here is the content of ventureOS/agents/${filename}:\n\n${content}`,
    });
    messages.push({
      role: 'assistant',
      content: `Agent file loaded: ${filename}. Operating in the appropriate specialist mode.`,
    });
  }
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

function indentText(text) {
  const B = '\x1b[1m', D = '\x1b[2m', R = '\x1b[0m';
  let inCode = false;
  const out = [];
  for (const raw of text.split('\n')) {
    if (raw.trimStart().startsWith('```')) {
      inCode = !inCode;
      out.push(D + '  ' + '─'.repeat(40) + R);
      continue;
    }
    if (inCode)                          { out.push(D + '  ' + raw + R); continue; }
    if (/^[-─]{3,}$/.test(raw.trim()))   { out.push('  ' + '─'.repeat(52)); continue; }
    if (raw.startsWith('### '))          { out.push('\n  ' + B + raw.slice(4).trim() + R); continue; }
    if (raw.startsWith('## '))           { out.push('\n  ' + B + raw.slice(3).trim() + R); continue; }
    if (raw.startsWith('# '))            { out.push('\n  ' + B + raw.slice(2).trim().toUpperCase() + R); continue; }
    if (/^\|[\s|:-]+\|$/.test(raw.trim())) continue;
    if (raw.trim().startsWith('|') && raw.trim().endsWith('|')) {
      const cells = raw.split('|').slice(1, -1).map(c => c.trim());
      out.push('  ' + cells.join('  │  ').replace(/\*\*(.+?)\*\*/g, B + '$1' + R));
      continue;
    }
    const ln = raw
      .replace(/\*\*(.+?)\*\*/g, B + '$1' + R)
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`([^`]+)`/g, D + '$1' + R);
    out.push('  ' + ln);
  }
  return out.join('\n');
}

// ─── LLM API calls ────────────────────────────────────────────────────────────

async function callLLM(provider, apiKey, model, system, messages) {
  if (provider === 'anthropic') return callAnthropic(apiKey, model, system, messages);
  if (provider === 'openai')    return callOpenAI(apiKey, model, system, messages);
  if (provider === 'gemini')    return callGemini(apiKey, model, system, messages);
  throw new Error(`Unknown provider: ${provider}`);
}

async function callViaCLI(cliCmd, system, messages) {
  // Build full context: system + conversation history + latest user message.
  // Sent via stdin to avoid ARG_MAX limits and CLI option-parsing issues
  // (e.g. prompts that start with "---" being misread as flags).
  let prompt = system + '\n\n';

  for (const msg of messages.slice(0, -1)) {
    const role = msg.role === 'user' ? 'Human' : 'Assistant';
    prompt += `${role}: ${msg.content}\n\n`;
  }

  const lastMsg = messages[messages.length - 1];
  prompt += `Human: ${lastMsg.content}`;

  return new Promise((resolve, reject) => {
    const proc = spawn(cliCmd, ['--print', '--dangerously-skip-permissions'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', chunk => { stdout += chunk; });
    proc.stderr.on('data', chunk => { stderr += chunk; });

    proc.on('close', code => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `${cliCmd} CLI exited with code ${code}`));
      } else {
        resolve(stdout.trim());
      }
    });

    proc.on('error', reject);

    proc.stdin.write(prompt, 'utf8');
    proc.stdin.end();
  });
}


async function callAnthropic(apiKey, model, system, messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model, max_tokens: 8192, system, messages }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error?.message || `HTTP ${res.status}`);
  }
  return (await res.json()).content[0].text;
}

async function callOpenAI(apiKey, model, system, messages) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error?.message || `HTTP ${res.status}`);
  }
  return (await res.json()).choices[0].message.content;
}

async function callGemini(apiKey, model, system, messages) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents,
    }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error?.message || `HTTP ${res.status}`);
  }
  return (await res.json()).candidates[0].content.parts[0].text;
}
