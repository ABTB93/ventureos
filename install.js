#!/usr/bin/env node
/**
 * VentureOS CLI
 * Usage:
 *   npx ventureos install   — interactive installer
 *   npx ventureos start     — launch Victor chat (Claude, ChatGPT, or Gemini)
 *   npx ventureos           — same as install
 *
 * Zero npm dependencies — pure Node.js (readline/promises, fs, path, url, fetch)
 * Requires Node.js >= 18.0.0
 */

import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const PACKAGE_ROOT = path.dirname(__filename);

const cmd = process.argv[2];

if (cmd === 'start') {
  startChat().catch(err => {
    if (err.code !== 'ERR_USE_AFTER_CLOSE') {
      console.error('\n  ❌ Error:', err.message, '\n');
      process.exit(1);
    }
  });
} else {
  install().catch(err => {
    if (err.code !== 'ERR_USE_AFTER_CLOSE') {
      console.error('\n  ❌ Installation error:', err.message);
      process.exit(1);
    }
  });
}

// ─── Shared Utilities ──────────────────────────────────────────────────────────

function line() {
  return '  ' + '─'.repeat(50);
}

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

// ─── Install ───────────────────────────────────────────────────────────────────

const SKIP = new Set([
  'install.js', 'package.json', 'package-lock.json',
  '.gitignore', 'config.yaml', 'node_modules', '.git', '.DS_Store',
]);

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

function generateConfig({ userName, language, researchDepth, llm, defaultMode }) {
  return `# VentureOS Configuration
# Edit this file anytime to update your settings.
# ─────────────────────────────────────────

# Your name — used by agents to address you
user_name: "${userName}"

# Active venture name — leave blank to start a new venture
venture_name: ""

# Language for all agent communication
# Options: English | French | Arabic | Spanish | Portuguese | Other
communication_language: "${language}"

# Where venture outputs are saved (relative to project root)
output_folder: "_ventures"

# Research depth for domain and market research agents
# light    = high-level overview, fast
# standard = structured analysis with sourced data (recommended)
# deep     = exhaustive multi-source research with cross-validation
research_depth: "${researchDepth}"

# Your primary AI tool
# Options: claude-code | cursor | windsurf | other
llm: "${llm}"

# Execution mode for workflows
# guided = agent pauses at each checkpoint for review and approval (recommended)
# yolo   = agent runs the full workflow autonomously
default_mode: "${defaultMode}"
`;
}

function showNextSteps(llm, ventureOSDir, targetDir) {
  const rel = path.relative(targetDir, ventureOSDir);

  console.log('\n' + line());
  console.log('  How to start VentureOS');
  console.log(line() + '\n');

  if (llm === 'claude-code') {
    console.log('  Option A — In Claude Code:\n');
    console.log(`    @${rel}/venture-master.md\n`);
    console.log('  Option B — Terminal chat:\n');
    console.log(`    npx ventureos start\n`);
  } else if (llm === 'cursor') {
    console.log('  Option A — In Cursor, attach the file in chat:\n');
    console.log(`    Click paperclip → select ${rel}/venture-master.md\n`);
    console.log('  Option B — Terminal chat:\n');
    console.log(`    npx ventureos start\n`);
  } else if (llm === 'windsurf') {
    console.log('  Option A — In Windsurf Cascade:\n');
    console.log(`    Load ${rel}/venture-master.md\n`);
    console.log('  Option B — Terminal chat:\n');
    console.log(`    npx ventureos start\n`);
  } else {
    console.log('  Start VentureOS from the terminal:\n');
    console.log(`    npx ventureos start\n`);
    console.log('  Connects directly to Claude, ChatGPT, or Gemini — no copy-pasting.\n');
  }

  console.log(line());
  console.log('  Victor (your VentureOS orchestrator) will:');
  console.log(line() + '\n');
  console.log('    1. Read your config and venture state');
  console.log('    2. Display the phase-aware menu');
  console.log('    3. Guide you through your venture building journey\n');
  console.log('  Commands to get started:');
  console.log('    [NV]  New Venture  — start a new venture (idea or domain)');
  console.log('    [EX]  Explore      — run a domain deep dive first');
  console.log('    [VS]  Status       — view venture status and next actions\n');
  console.log(line() + '\n');
}

async function install() {
  console.log('\n');
  console.log('  ┌' + '─'.repeat(52) + '┐');
  console.log('  │                                                    │');
  console.log('  │   🚀  VentureOS                                    │');
  console.log('  │   AI-Powered Venture Building Framework            │');
  console.log('  │                                                    │');
  console.log('  └' + '─'.repeat(52) + '┘');
  console.log('\n');

  const rl = readline.createInterface({ input, output });

  try {
    // Step 1: Installation directory
    const defaultTarget = process.cwd();
    console.log('  📁 Installation directory');
    console.log(`     Default: ${defaultTarget}`);
    const targetInput = await rl.question('     Press Enter to confirm, or type a different path: ');
    const targetDir = path.resolve(targetInput.trim() || defaultTarget);
    const ventureOSDir = path.join(targetDir, 'ventureOS');

    if (fs.existsSync(ventureOSDir)) {
      console.log('\n  ⚠️  VentureOS is already installed in this directory.');
      const ans = await rl.question('     Update/reinstall? (y/N): ');
      if (!ans.trim().toLowerCase().startsWith('y')) {
        console.log('\n  Installation cancelled. Your existing installation is unchanged.\n');
        rl.close();
        return;
      }
      console.log('\n  Updating existing installation...');
    }

    // Step 2: User name
    console.log('\n' + line());
    console.log('  About you');
    console.log(line() + '\n');
    const nameInput = await rl.question('  👤 Your name: ');
    const userName = nameInput.trim() || 'Founder';

    // Step 3: AI tool
    console.log('\n  🤖 Which AI tool do you use for coding?\n');
    console.log('     1.  Claude Code  (recommended)');
    console.log('     2.  Cursor');
    console.log('     3.  Windsurf');
    console.log('     4.  Other\n');
    const llmInput = await rl.question('     Select [1-4]: ');
    const llmMap = { '1': 'claude-code', '2': 'cursor', '3': 'windsurf', '4': 'other' };
    const llm = llmMap[llmInput.trim()] ?? 'claude-code';

    // Step 4: Language
    console.log('\n  🌍 Language for agent communication?\n');
    console.log('     1.  English     (default)');
    console.log('     2.  French');
    console.log('     3.  Arabic');
    console.log('     4.  Spanish');
    console.log('     5.  Portuguese');
    console.log('     6.  Other\n');
    const langInput = await rl.question('     Select [1-6]: ');
    const langMap = { '1': 'English', '2': 'French', '3': 'Arabic', '4': 'Spanish', '5': 'Portuguese' };
    let language = langMap[langInput.trim()] ?? 'English';
    if (langInput.trim() === '6') {
      const custom = await rl.question('     Specify language: ');
      language = custom.trim() || 'English';
    }

    // Step 5: Research depth
    console.log('\n  🔍 Research depth for market and domain analysis?\n');
    console.log('     1.  Standard  — structured analysis with sourced data  (recommended)');
    console.log('     2.  Light     — high-level overview, fast');
    console.log('     3.  Deep      — exhaustive multi-source research with validation\n');
    const depthInput = await rl.question('     Select [1-3]: ');
    const depthMap = { '1': 'standard', '2': 'light', '3': 'deep' };
    const researchDepth = depthMap[depthInput.trim()] ?? 'standard';

    // Step 6: Default mode
    console.log('\n  ⚙️  Default workflow execution mode?\n');
    console.log('     1.  Guided  — agent pauses for your review at each step  (recommended)');
    console.log('     2.  Yolo    — agent runs full workflows autonomously\n');
    const modeInput = await rl.question('     Select [1-2]: ');
    const defaultMode = modeInput.trim() === '2' ? 'yolo' : 'guided';

    rl.close();

    // Install files
    console.log('\n' + line());
    console.log('  Installing...');
    console.log(line() + '\n');

    copyDir(PACKAGE_ROOT, ventureOSDir, SKIP);
    console.log('  ✓ Framework files installed');

    const config = generateConfig({ userName, language, researchDepth, llm, defaultMode });
    fs.writeFileSync(path.join(ventureOSDir, 'config.yaml'), config, 'utf8');
    console.log('  ✓ Configuration written  →  ventureOS/config.yaml');

    const venturesDir = path.join(targetDir, '_ventures');
    if (!fs.existsSync(venturesDir)) {
      fs.mkdirSync(venturesDir, { recursive: true });
      fs.writeFileSync(path.join(venturesDir, '.gitkeep'), '', 'utf8');
    }
    console.log('  ✓ Output folder ready    →  _ventures/');

    const gitignorePath = path.join(targetDir, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, '# VentureOS outputs\n_ventures/\nnode_modules/\n.DS_Store\n', 'utf8');
      console.log('  ✓ .gitignore created');
    }

    console.log('\n' + line());
    console.log('  ✅ VentureOS is ready!');
    console.log(line());

    showNextSteps(llm, ventureOSDir, targetDir);

  } catch (err) {
    rl.close();
    if (err.code === 'ERR_USE_AFTER_CLOSE') return;
    console.error('\n  ❌ Installation error:', err.message);
    process.exit(1);
  }
}

// ─── Start / Chat ──────────────────────────────────────────────────────────────

const PROVIDERS = {
  anthropic: {
    label:        'Claude (Anthropic)',
    envVar:       'ANTHROPIC_API_KEY',
    defaultModel: 'claude-opus-4-6',
  },
  openai: {
    label:        'ChatGPT (OpenAI)',
    envVar:       'OPENAI_API_KEY',
    defaultModel: 'gpt-4o',
  },
  gemini: {
    label:        'Gemini (Google)',
    envVar:       'GOOGLE_API_KEY',
    defaultModel: 'gemini-2.0-flash',
  },
};

async function startChat() {
  console.log('\n');
  console.log('  ┌' + '─'.repeat(52) + '┐');
  console.log('  │                                                    │');
  console.log('  │   🚀  VentureOS — Starting Victor                  │');
  console.log('  │                                                    │');
  console.log('  └' + '─'.repeat(52) + '┘');
  console.log('\n');

  const projectRoot = process.cwd();
  const configPath = path.join(projectRoot, 'ventureOS', 'config.yaml');

  if (!fs.existsSync(configPath)) {
    console.error('  ❌ VentureOS is not installed here. Run: npx ventureos install\n');
    process.exit(1);
  }

  const config = parseSimpleYaml(fs.readFileSync(configPath, 'utf8'));
  const rl = readline.createInterface({ input, output });

  // ── Select provider ────────────────────────────────────────────────────────
  let providerKey;
  if (config.llm === 'claude-code') {
    providerKey = 'anthropic';
  } else {
    console.log('  🤖 Which AI provider do you want to use?\n');
    console.log('     1.  Claude (Anthropic)');
    console.log('     2.  ChatGPT (OpenAI)');
    console.log('     3.  Gemini (Google)\n');
    const choice = await rl.question('     Select [1-3]: ');
    providerKey = ({ '1': 'anthropic', '2': 'openai', '3': 'gemini' })[choice.trim()] ?? 'anthropic';
  }

  const provider = PROVIDERS[providerKey];

  // ── Get API key ────────────────────────────────────────────────────────────
  let apiKey = process.env[provider.envVar];
  if (!apiKey) {
    console.log(`\n  🔑 ${provider.envVar} not set in environment.`);
    apiKey = (await rl.question(`     Enter your ${provider.label} API key: `)).trim();
    if (!apiKey) {
      console.error('\n  ❌ No API key provided.\n');
      rl.close();
      process.exit(1);
    }
    console.log(`\n  💡 Tip: export ${provider.envVar}=your-key  to skip this next time.\n`);
  }

  // ── Load system prompt ─────────────────────────────────────────────────────
  const masterPath = path.join(projectRoot, 'ventureOS', 'venture-master.md');
  let systemPrompt = fs.readFileSync(masterPath, 'utf8')
    .replace(/\{project-root\}/g, projectRoot);

  // ── Inject config + venture state as context ───────────────────────────────
  const configContent = fs.readFileSync(configPath, 'utf8');
  const statePath = path.join(projectRoot, 'ventureOS', '_memory', 'venture-state.yaml');
  const stateContent = fs.existsSync(statePath)
    ? fs.readFileSync(statePath, 'utf8')
    : 'No venture state yet — this is a fresh start.';

  const activationMsg =
    `Activate.\n\n` +
    `--- ventureOS/config.yaml ---\n${configContent}\n\n` +
    `--- ventureOS/_memory/venture-state.yaml ---\n${stateContent}`;

  console.log(line());
  console.log(`  ✓ Connected to ${provider.label}`);
  console.log(`  ✓ Type your message and press Enter. Type "exit" or Ctrl+C to quit.`);
  console.log(line() + '\n');

  const messages = [];

  // ── Initial activation call ────────────────────────────────────────────────
  showSpinner('  Victor is thinking');
  let firstResponse;
  try {
    firstResponse = await callLLM(providerKey, apiKey, provider.defaultModel, systemPrompt, [
      { role: 'user', content: activationMsg },
    ]);
  } catch (err) {
    stopSpinner();
    console.error(`\n  ❌ API error: ${err.message}`);
    console.error(`  Check your API key and try again.\n`);
    rl.close();
    process.exit(1);
  }
  stopSpinner();

  console.log('\n' + indentText(firstResponse) + '\n');
  messages.push({ role: 'user', content: activationMsg });
  messages.push({ role: 'assistant', content: firstResponse });
  await autoLoadAgents(firstResponse, messages, projectRoot);

  // ── Main chat loop ─────────────────────────────────────────────────────────
  while (true) {
    let userInput;
    try {
      userInput = await rl.question('  You: ');
    } catch {
      break; // Ctrl+C
    }

    const trimmed = userInput.trim();
    if (!trimmed) continue;
    if (['exit', 'quit', 'da', '/exit'].includes(trimmed.toLowerCase())) {
      console.log('\n  Victor: Safe travels. Your venture state has been saved. 🚀\n');
      break;
    }

    messages.push({ role: 'user', content: trimmed });

    showSpinner('  Victor is thinking');
    let response;
    try {
      response = await callLLM(providerKey, apiKey, provider.defaultModel, systemPrompt, messages);
    } catch (err) {
      stopSpinner();
      console.error(`\n  ❌ API error: ${err.message}\n`);
      messages.pop();
      continue;
    }
    stopSpinner();

    console.log('\n' + indentText(response) + '\n');
    messages.push({ role: 'assistant', content: response });
    await autoLoadAgents(response, messages, projectRoot);
  }

  rl.close();
}

// ─── Spinner ───────────────────────────────────────────────────────────────────

let _spinner;
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

// ─── Formatting ───────────────────────────────────────────────────────────────

function indentText(text) {
  return text.split('\n').map(l => '  ' + l).join('\n');
}

// ─── LLM API calls — zero dependencies, native fetch ──────────────────────────

async function callLLM(provider, apiKey, model, system, messages) {
  if (provider === 'anthropic') return callAnthropic(apiKey, model, system, messages);
  if (provider === 'openai')    return callOpenAI(apiKey, model, system, messages);
  if (provider === 'gemini')    return callGemini(apiKey, model, system, messages);
  throw new Error(`Unknown provider: ${provider}`);
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
