#!/usr/bin/env node
/**
 * VentureOS Installer
 * Usage: npx ventureos install
 *        npx ventureos
 *
 * Zero npm dependencies — pure Node.js (readline/promises, fs, path, url)
 * Requires Node.js >= 18.0.0
 */

import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const PACKAGE_ROOT = path.dirname(__filename);

// These files live in the npm package but should NOT be copied to the user's project
const SKIP = new Set([
  'install.js',
  'package.json',
  'package-lock.json',
  '.gitignore',
  'config.yaml',   // We generate a populated one from user answers
  'node_modules',
  '.git',
  '.DS_Store',
]);

// ─── Utilities ───────────────────────────────────────────────────────────────

function copyDir(src, dest, skipSet = new Set()) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    if (skipSet.has(entry)) continue;
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath); // Recurse — no skip needed for subdirs
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
# Default: _ventures/{venture_name}/
output_folder: "_ventures"

# Research depth for domain and market research agents
# light    = high-level overview, fast
# standard = structured analysis with sourced data (recommended)
# deep     = exhaustive multi-source research with cross-validation
research_depth: "${researchDepth}"

# Your primary AI tool
# Affects how agents describe file loading and tool usage in instructions
# Options: claude-code | cursor | windsurf | other
llm: "${llm}"

# Execution mode for workflows
# guided = agent pauses at each checkpoint for review and approval (recommended)
# yolo   = agent runs the full workflow autonomously and presents all outputs at the end
default_mode: "${defaultMode}"
`;
}

function showNextSteps(llm, ventureOSDir, targetDir) {
  const rel = path.relative(targetDir, ventureOSDir);

  console.log('\n' + line());
  console.log('  How to start VentureOS');
  console.log(line() + '\n');

  if (llm === 'claude-code') {
    console.log('  In Claude Code, reference the orchestrator:\n');
    console.log(`    @${rel}/venture-master.md\n`);
    console.log('  Or from the terminal:\n');
    console.log(`    claude ${rel}/venture-master.md\n`);
  } else if (llm === 'cursor') {
    console.log('  In Cursor, attach the file in chat:\n');
    console.log(`    1. Open chat (Cmd+L or Ctrl+L)`);
    console.log(`    2. Click the paperclip icon`);
    console.log(`    3. Select: ${rel}/venture-master.md\n`);
    console.log('  Or type in chat:\n');
    console.log(`    Load @${rel}/venture-master.md and activate Victor.\n`);
  } else if (llm === 'windsurf') {
    console.log('  In Windsurf Cascade, type:\n');
    console.log(`    Load ${rel}/venture-master.md and follow the activation instructions.\n`);
  } else {
    console.log('  To start VentureOS:\n');
    console.log(`    1. Open ${rel}/venture-master.md`);
    console.log(`    2. Copy the full file contents`);
    console.log(`    3. Paste as your first message in a new AI conversation\n`);
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

function line() {
  return '  ' + '─'.repeat(50);
}

function banner() {
  console.log('\n');
  console.log('  ┌' + '─'.repeat(52) + '┐');
  console.log('  │                                                    │');
  console.log('  │   🚀  VentureOS                                    │');
  console.log('  │   AI-Powered Venture Building Framework            │');
  console.log('  │   v1.0.0                                           │');
  console.log('  │                                                    │');
  console.log('  └' + '─'.repeat(52) + '┘');
  console.log('\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  banner();

  const rl = readline.createInterface({ input, output });

  try {
    // ── Step 1: Installation directory ───────────────────────────────────────
    const defaultTarget = process.cwd();
    console.log('  📁 Installation directory');
    console.log(`     Default: ${defaultTarget}`);
    const targetInput = await rl.question('     Press Enter to confirm, or type a different path: ');
    const targetDir = path.resolve(targetInput.trim() || defaultTarget);
    const ventureOSDir = path.join(targetDir, 'ventureOS');

    // Existing installation check
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

    // ── Step 2: User name ─────────────────────────────────────────────────────
    console.log('\n' + line());
    console.log('  About you');
    console.log(line() + '\n');

    const nameInput = await rl.question('  👤 Your name: ');
    const userName = nameInput.trim() || 'Founder';

    // ── Step 3: AI tool ───────────────────────────────────────────────────────
    console.log('\n  🤖 Which AI tool do you use for coding?\n');
    console.log('     1.  Claude Code  (recommended)');
    console.log('     2.  Cursor');
    console.log('     3.  Windsurf');
    console.log('     4.  Other\n');
    const llmInput = await rl.question('     Select [1-4]: ');
    const llmMap = { '1': 'claude-code', '2': 'cursor', '3': 'windsurf', '4': 'other' };
    const llm = llmMap[llmInput.trim()] ?? 'claude-code';

    // ── Step 4: Language ──────────────────────────────────────────────────────
    console.log('\n  🌍 Language for agent communication?\n');
    console.log('     1.  English     (default)');
    console.log('     2.  French');
    console.log('     3.  Arabic');
    console.log('     4.  Spanish');
    console.log('     5.  Portuguese');
    console.log('     6.  Other\n');
    const langInput = await rl.question('     Select [1-6]: ');
    const langMap = {
      '1': 'English', '2': 'French', '3': 'Arabic',
      '4': 'Spanish', '5': 'Portuguese',
    };
    let language = langMap[langInput.trim()] ?? 'English';
    if (langInput.trim() === '6') {
      const custom = await rl.question('     Specify language: ');
      language = custom.trim() || 'English';
    }

    // ── Step 5: Research depth ────────────────────────────────────────────────
    console.log('\n  🔍 Research depth for market and domain analysis?\n');
    console.log('     1.  Standard  — structured analysis with sourced data  (recommended)');
    console.log('     2.  Light     — high-level overview, fast');
    console.log('     3.  Deep      — exhaustive multi-source research with validation\n');
    const depthInput = await rl.question('     Select [1-3]: ');
    const depthMap = { '1': 'standard', '2': 'light', '3': 'deep' };
    const researchDepth = depthMap[depthInput.trim()] ?? 'standard';

    // ── Step 6: Default mode ──────────────────────────────────────────────────
    console.log('\n  ⚙️  Default workflow execution mode?\n');
    console.log('     1.  Guided  — agent pauses for your review at each step  (recommended)');
    console.log('     2.  Yolo    — agent runs full workflows autonomously\n');
    const modeInput = await rl.question('     Select [1-2]: ');
    const defaultMode = modeInput.trim() === '2' ? 'yolo' : 'guided';

    rl.close();

    // ── Install ───────────────────────────────────────────────────────────────
    console.log('\n' + line());
    console.log('  Installing...');
    console.log(line() + '\n');

    // 1. Copy framework files
    copyDir(PACKAGE_ROOT, ventureOSDir, SKIP);
    console.log('  ✓ Framework files installed');

    // 2. Write populated config.yaml
    const config = generateConfig({ userName, language, researchDepth, llm, defaultMode });
    fs.writeFileSync(path.join(ventureOSDir, 'config.yaml'), config, 'utf8');
    console.log('  ✓ Configuration written  →  ventureOS/config.yaml');

    // 3. Create _ventures output directory
    const venturesDir = path.join(targetDir, '_ventures');
    if (!fs.existsSync(venturesDir)) {
      fs.mkdirSync(venturesDir, { recursive: true });
      fs.writeFileSync(path.join(venturesDir, '.gitkeep'), '', 'utf8');
    }
    console.log('  ✓ Output folder ready    →  _ventures/');

    // 4. Create .gitignore if missing
    const gitignorePath = path.join(targetDir, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(
        gitignorePath,
        '# VentureOS outputs\n_ventures/\nnode_modules/\n.DS_Store\n',
        'utf8'
      );
      console.log('  ✓ .gitignore created');
    }

    // ── Done ──────────────────────────────────────────────────────────────────
    console.log('\n' + line());
    console.log('  ✅ VentureOS is ready!');
    console.log(line());

    showNextSteps(llm, ventureOSDir, targetDir);

  } catch (err) {
    rl.close();
    if (err.code === 'ERR_USE_AFTER_CLOSE') return; // User Ctrl+C'd
    console.error('\n  ❌ Installation error:', err.message);
    process.exit(1);
  }
}

main();
