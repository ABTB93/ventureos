import fs from 'fs';
import path from 'path';

const STATIC_PROJECT_REF =
  /(?:\{project-root\}\/ventureOS\/|ventureOS\/)([A-Za-z0-9_./-]+\.(?:md|yaml|xml|csv))/g;
const HANDLER_REF =
  /(?:exec|workflow)=\"\{project-root\}\/ventureOS\/([^\"]+\.(?:md|yaml))\"/g;
const YAML_PATH_REF = /"(\{project-root\}\/ventureOS\/[^"]+\.(?:md|yaml|xml|csv))"/g;

function walkFiles(rootDir) {
  const files = [];
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function collectMatches(content, regex) {
  return [...content.matchAll(regex)].map((match) => match[1]);
}

function validateStaticRefs(rootDir, filePath, content, issues) {
  const matches = new Set([
    ...collectMatches(content, STATIC_PROJECT_REF),
    ...collectMatches(content, HANDLER_REF),
  ]);

  for (const relativePath of matches) {
    const absolutePath = path.join(rootDir, relativePath);
    if (!fs.existsSync(absolutePath)) {
      issues.push(`${path.relative(rootDir, filePath)} references missing file ${relativePath}`);
    }
  }
}

function validateWorkflowYaml(rootDir, filePath, issues) {
  const content = fs.readFileSync(filePath, 'utf8');
  const requiredKeys = ['name:', 'description:', 'installed_path:', 'instructions:', 'execution_hints:'];

  for (const key of requiredKeys) {
    if (!content.includes(key)) {
      issues.push(`${path.relative(rootDir, filePath)} is missing required key ${key}`);
    }
  }

  const staticRefs = collectMatches(content, YAML_PATH_REF)
    .map((rawPath) => rawPath.replace('{project-root}/ventureOS/', ''))
    .filter((rawPath) => !rawPath.includes('{installed_path}') && !rawPath.includes('{config_source}') && !rawPath.includes('{output_folder}') && !rawPath.includes('{venture_name}'));

  for (const relativePath of staticRefs) {
    const absolutePath = path.join(rootDir, relativePath);
    if (!fs.existsSync(absolutePath)) {
      issues.push(`${path.relative(rootDir, filePath)} references missing asset ${relativePath}`);
    }
  }

  const instructionsRef = content.match(/instructions:\s+"?\{installed_path\}\/([^"\n]+)"/);
  if (instructionsRef) {
    const instructionsPath = path.join(path.dirname(filePath), instructionsRef[1]);
    if (!fs.existsSync(instructionsPath)) {
      issues.push(`${path.relative(rootDir, filePath)} is missing local instructions file ${path.relative(rootDir, instructionsPath)}`);
    }
  }
}

function validateConfigTemplate(rootDir, issues) {
  const configPath = path.join(rootDir, 'config.yaml');
  const config = fs.readFileSync(configPath, 'utf8');
  const requiredKeys = [
    'user_name:',
    'venture_name:',
    'output_folder:',
    'research_depth:',
    'llm:',
    'default_mode:',
    'region:',
  ];

  for (const key of requiredKeys) {
    if (!config.includes(key)) {
      issues.push(`config.yaml is missing required key ${key}`);
    }
  }
}

function validateStateTemplate(rootDir, issues) {
  const statePath = path.join(rootDir, '_memory', 'venture-state.yaml');
  const state = fs.readFileSync(statePath, 'utf8');
  const requiredKeys = [
    'venture_name:',
    'current_phase:',
    'current_week:',
    'entry_point:',
    'status:',
    'category_progress:',
    'guiding_questions:',
    'completed_artifacts:',
    'gate_history:',
    'pivot_count:',
    'pivot_history:',
  ];

  for (const key of requiredKeys) {
    if (!state.includes(key)) {
      issues.push(`_memory/venture-state.yaml is missing required key ${key}`);
    }
  }
}

export function validateRepoContracts(rootDir) {
  const issues = [];
  const files = walkFiles(rootDir);

  for (const filePath of files) {
    if (path.basename(filePath) === '.DS_Store') {
      issues.push(`Remove committed junk file ${path.relative(rootDir, filePath)}`);
      continue;
    }

    if (/\.(md|yaml|xml)$/.test(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      validateStaticRefs(rootDir, filePath, content, issues);
    }

    if (path.basename(filePath) === 'workflow.yaml') {
      validateWorkflowYaml(rootDir, filePath, issues);
    }
  }

  validateConfigTemplate(rootDir, issues);
  validateStateTemplate(rootDir, issues);

  return issues;
}
