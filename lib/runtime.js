import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

export const PROVIDERS = {
  anthropic: {
    label: 'Claude (Anthropic)',
    envVar: 'ANTHROPIC_API_KEY',
    defaultModel: 'claude-opus-4-6',
    keyUrl: 'https://console.anthropic.com',
  },
  openai: {
    label: 'ChatGPT (OpenAI)',
    envVar: 'OPENAI_API_KEY',
    defaultModel: 'gpt-4o',
    keyUrl: 'https://platform.openai.com/api-keys',
  },
  gemini: {
    label: 'Gemini (Google)',
    envVar: 'GOOGLE_API_KEY',
    defaultModel: 'gemini-2.0-flash',
    keyUrl: 'https://aistudio.google.com/app/apikey',
  },
};

export const IDE_TOOLS = [
  {
    id: 'cursor',
    llm: 'cursor',
    label: 'Cursor',
    description: 'no API key needed',
    cmds: ['cursor'],
    appPaths: ['/Applications/Cursor.app'],
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
    id: 'windsurf',
    llm: 'windsurf',
    label: 'Windsurf',
    description: 'no API key needed',
    cmds: ['windsurf'],
    appPaths: ['/Applications/Windsurf.app'],
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
    id: 'claude',
    llm: 'claude-code',
    label: 'Claude Code',
    description: 'no API key needed',
    cmds: ['claude'],
    appPaths: [],
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
    id: 'antigravity',
    llm: 'other',
    label: 'Antigravity',
    description: 'free, no API key needed',
    cmds: ['antigravity'],
    appPaths: ['/Applications/Antigravity.app'],
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

const IDE_LLM_VALUES = new Set(IDE_TOOLS.map((tool) => tool.llm));

export function isIdeLlm(llm) {
  return IDE_LLM_VALUES.has(llm);
}

export function getIdeToolByLlm(llm) {
  return IDE_TOOLS.find((tool) => tool.llm === llm) || null;
}

export function resolveProviderKey(llm) {
  return PROVIDERS[llm] ? llm : null;
}

export function parseSimpleYaml(text) {
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

export function detectIDEs() {
  const found = [];
  for (const ide of IDE_TOOLS) {
    const byCLI = ide.cmds.some((c) => {
      try {
        const r = spawnSync('which', [c], { encoding: 'utf8', stdio: 'pipe' });
        return r.status === 0 && r.stdout.trim();
      } catch {
        return false;
      }
    });
    const byApp = ide.appPaths.some((p) => {
      try {
        return fs.existsSync(p);
      } catch {
        return false;
      }
    });
    if (byCLI || byApp) found.push(ide);
  }
  return found;
}

export function copyDir(src, dest, skipSet = new Set()) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    if (skipSet.has(entry)) continue;
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath, skipSet);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
