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
import { spawnSync, spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const PACKAGE_ROOT = path.dirname(__filename);

// Must be defined before startChat() runs (accessed synchronously before first await)
let _spinner;

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

// CLI tools that can be used instead of an API key
const CLI_TOOLS = {
  anthropic: { cmd: 'claude', label: 'Claude CLI' },
};

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

# Your AI provider
# Options: anthropic | openai | gemini
llm: "${llm}"

# Execution mode for workflows
# guided = agent pauses at each checkpoint for review and approval (recommended)
# yolo   = agent runs the full workflow autonomously
default_mode: "${defaultMode}"
`;
}

function showNextSteps(ventureOSDir, targetDir) {
  console.log('\n' + line());
  console.log('  How to start VentureOS');
  console.log(line() + '\n');
  console.log('  Run this command from your project folder:\n');
  console.log('    npx ventureos start\n');
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

    // Step 3: AI provider
    console.log('\n  🤖 Which AI provider do you use?\n');
    console.log('     1.  Claude (Anthropic)  (recommended)');
    console.log('     2.  ChatGPT (OpenAI)');
    console.log('     3.  Gemini (Google)\n');
    const llmInput = await rl.question('     Select [1-3]: ');
    const llmMap = { '1': 'anthropic', '2': 'openai', '3': 'gemini' };
    const llm = llmMap[llmInput.trim()] ?? 'anthropic';

    // Step 4: Research depth
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

    const config = generateConfig({ userName, researchDepth, llm, defaultMode });
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

    showNextSteps(ventureOSDir, targetDir);

  } catch (err) {
    rl.close();
    if (err.code === 'ERR_USE_AFTER_CLOSE') return;
    console.error('\n  ❌ Installation error:', err.message);
    process.exit(1);
  }
}

// ─── Start / Chat ──────────────────────────────────────────────────────────────

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

  // ── Select provider from config ────────────────────────────────────────────
  const providerKey = PROVIDERS[config.llm] ? config.llm : 'anthropic';
  const provider = PROVIDERS[providerKey];

  // ── Get API key or use CLI mode ────────────────────────────────────────────
  let apiKey = process.env[provider.envVar];
  let useCLI = false;
  let cliCmd = null;

  if (!apiKey) {
    const cli = detectCLI(providerKey);
    if (cli) {
      console.log(`\n  🔑 ${provider.envVar} not set in environment.\n`);
      console.log(`     How would you like to connect?\n`);
      console.log(`     1.  Enter API key`);
      console.log(`     2.  Use ${cli.label} (detected on your system)\n`);
      const choice = (await rl.question('     Select [1-2]: ')).trim();
      if (choice === '2') {
        useCLI = true;
        cliCmd = cli.cmd;
      } else {
        apiKey = (await rl.question(`\n     Enter your ${provider.label} API key: `)).trim();
        if (!apiKey) {
          console.error('\n  ❌ No API key provided.\n');
          rl.close();
          process.exit(1);
        }
        console.log(`\n  💡 Tip: export ${provider.envVar}=your-key  to skip this next time.\n`);
      }
    } else {
      console.log(`\n  🔑 ${provider.envVar} not set in environment.`);
      apiKey = (await rl.question(`     Enter your ${provider.label} API key: `)).trim();
      if (!apiKey) {
        console.error('\n  ❌ No API key provided.\n');
        rl.close();
        process.exit(1);
      }
      console.log(`\n  💡 Tip: export ${provider.envVar}=your-key  to skip this next time.\n`);
    }
  }

  // ── If using Claude CLI, redirect to native Claude Code experience ─────────
  if (useCLI && cliCmd === 'claude') {
    console.log(line());
    console.log('  Use Claude Code natively — it\'s a much better experience.\n');
    console.log('  In Claude Code, start your VentureOS session by typing:\n');
    console.log('    @ventureOS/venture-master.md\n');
    console.log('  That gives you full markdown rendering, streaming, and all');
    console.log('  native Claude Code features — no terminal wrapper needed.');
    console.log(line() + '\n');
    rl.close();
    process.exit(0);
  }

  // ── Load system prompt ─────────────────────────────────────────────────────
  const masterPath = path.join(projectRoot, 'ventureOS', 'venture-master.md');
  let systemPrompt = fs.readFileSync(masterPath, 'utf8')
    .replace(/\{project-root\}/g, projectRoot)
    .replace(/\{communication_language\}/g, 'English')
    .replace(/\{user_name\}/g, config.user_name || 'Founder')
    .replace(/\{llm\}/g, config.llm || 'anthropic')
    .replace(/\{research_depth\}/g, config.research_depth || 'standard')
    .replace(/\{default_mode\}/g, config.default_mode || 'guided')
    .replace(/\{output_folder\}/g, config.output_folder || '_ventures');

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
  console.log(`  ✓ Connected ${useCLI ? `via ${cliCmd} CLI` : `to ${provider.label}`}`);
  console.log(`  ✓ Type your message and press Enter. Type "exit" or Ctrl+C to quit.`);
  console.log(line() + '\n');

  const messages = [];

  // ── Initial activation call ────────────────────────────────────────────────
  showSpinner('  Victor is thinking');
  let firstResponse;
  try {
    firstResponse = useCLI
      ? await callViaCLI(cliCmd, systemPrompt, [{ role: 'user', content: activationMsg }])
      : await callLLM(providerKey, apiKey, provider.defaultModel, systemPrompt, [{ role: 'user', content: activationMsg }]);
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
      response = useCLI
        ? await callViaCLI(cliCmd, systemPrompt, messages)
        : await callLLM(providerKey, apiKey, provider.defaultModel, systemPrompt, messages);
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

// ─── CLI Detection ─────────────────────────────────────────────────────────────

function detectCLI(providerKey) {
  const tool = CLI_TOOLS[providerKey];
  if (!tool) return null;
  try {
    const result = spawnSync('which', [tool.cmd], { encoding: 'utf8', stdio: 'pipe' });
    return result.status === 0 && result.stdout.trim() ? tool : null;
  } catch {
    return null;
  }
}

// ─── Spinner ───────────────────────────────────────────────────────────────────
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

// ─── Markdown renderer (terminal-friendly, zero deps) ─────────────────────────

function indentText(text) {
  const B = '\x1b[1m', D = '\x1b[2m', R = '\x1b[0m', C = '\x1b[36m';
  let inCode = false;
  const out = [];

  for (const raw of text.split('\n')) {
    // Code fence toggle
    if (raw.trimStart().startsWith('```')) {
      inCode = !inCode;
      out.push(D + '  ' + '─'.repeat(40) + R);
      continue;
    }
    if (inCode) { out.push(D + '  ' + raw + R); continue; }

    // Horizontal rule
    if (/^[-─]{3,}$/.test(raw.trim())) { out.push('  ' + '─'.repeat(50)); continue; }

    // Headings
    if (raw.startsWith('### ')) { out.push('\n  ' + B + raw.slice(4).trim() + R); continue; }
    if (raw.startsWith('## '))  { out.push('\n  ' + B + raw.slice(3).trim() + R); continue; }
    if (raw.startsWith('# '))   { out.push('\n  ' + B + raw.slice(2).trim().toUpperCase() + R); continue; }

    // Table separator — skip
    if (/^\|[\s|:-]+\|$/.test(raw.trim())) continue;

    // Table row
    if (raw.trim().startsWith('|') && raw.trim().endsWith('|')) {
      const cells = raw.split('|').slice(1, -1).map(c => c.trim());
      out.push('  ' + cells.join('  │  ').replace(/\*\*(.+?)\*\*/g, B + '$1' + R));
      continue;
    }

    // Inline: bold, italic, code
    const line = raw
      .replace(/\*\*(.+?)\*\*/g, B + '$1' + R)
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`([^`]+)`/g, D + '$1' + R);

    out.push('  ' + line);
  }

  return out.join('\n');
}

// ─── LLM API calls — zero dependencies, native fetch ──────────────────────────

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
