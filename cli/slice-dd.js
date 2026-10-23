#!/usr/bin/env node
// Installs Slice into a project. No dependencies.
'use strict';
const fs = require('fs');
const path = require('path');

const PKG = path.join(__dirname, '..');
const USAGE = `Usage:
  npx slice-dd init [dir] [--agent claude|other]      install commands and templates
  npx slice-dd update [dir] [--agent claude|other]    refresh commands (keeps your templates)
  npx slice-dd uninstall [dir] [--agent claude|other] remove Slice's commands, keep .slice/`;

function fail(msg) {
  console.error(`slice-dd: ${msg}`);
  process.exit(1);
}

// --- arguments: strict, so a flag value is never mistaken for the directory ---
const [cmd, ...rest] = process.argv.slice(2);
if (!['init', 'update', 'uninstall'].includes(cmd)) { console.log(USAGE); process.exit(cmd ? 1 : 0); }
let agent = 'claude';
const positional = [];
for (let i = 0; i < rest.length; i++) {
  const a = rest[i];
  if (a === '--agent') agent = rest[++i];
  else if (a.startsWith('--agent=')) agent = a.slice('--agent='.length);
  else if (a.startsWith('-')) fail(`unknown option "${a}"\n${USAGE}`);
  else positional.push(a);
}
if (!['claude', 'other'].includes(agent)) fail(`--agent must be "claude" or "other"`);
if (positional.length > 1) fail(`expected at most one directory\n${USAGE}`);

const target = path.resolve(positional[0] || '.');
let st;
try { st = fs.statSync(target); } catch { fail(`directory not found: ${target}`); }
if (!st.isDirectory()) fail(`not a directory: ${target}`);

const rel = agent === 'claude' ? ['.claude', 'commands', 'slice'] : ['.slice', 'commands'];
const commandsDir = path.join(target, ...rel);

// --- safety: never write or delete through a symlink inside the project ---
// A cloned repo could plant e.g. .claude/commands/slice/init.md -> ~/.zshrc.
function lstatOrNull(p) { try { return fs.lstatSync(p); } catch { return null; } }

function ensureRealDir(base, parts) {
  let cur = base;
  for (const part of parts) {
    cur = path.join(cur, part);
    const s = lstatOrNull(cur);
    if (!s) fs.mkdirSync(cur);
    else if (s.isSymbolicLink()) fail(`refusing to follow symlink: ${cur}`);
    else if (!s.isDirectory()) fail(`not a directory: ${cur}`);
  }
  return cur;
}

// Only regular, non-hidden .md files are shipped (no .DS_Store, editor temp files…).
function shippedFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => !e.name.startsWith('.'))
    .filter((e) => e.isDirectory() || (e.isFile() && e.name.endsWith('.md')));
}

function copyDir(src, dstParts, overwrite) {
  const dst = ensureRealDir(target, dstParts);
  for (const e of shippedFiles(src)) {
    if (e.isDirectory()) { copyDir(path.join(src, e.name), [...dstParts, e.name], overwrite); continue; }
    const d = path.join(dst, e.name);
    const s = lstatOrNull(d);
    if (s && s.isSymbolicLink()) fail(`refusing to overwrite symlink: ${d}`);
    if (s && !s.isFile()) fail(`not a regular file: ${d}`);
    if (s && !overwrite) continue;
    fs.copyFileSync(path.join(src, e.name), d);
  }
}

if (cmd === 'init' || cmd === 'update') {
  copyDir(path.join(PKG, 'commands'), rel, true);                    // commands: always refreshed
  copyDir(path.join(PKG, 'templates'), ['.slice', 'templates'], false); // keep your edits
  ensureRealDir(target, ['.slice', 'slices']);
  console.log(`Slice ${cmd === 'init' ? 'installed' : 'updated'} in ${target}`);
  console.log(`  commands  → ${rel.join('/')}/`);
  console.log('  templates → .slice/templates/');
  console.log('Your genome, backlog and slices are never touched.');
  if (cmd === 'init') {
    console.log(agent === 'claude'
      ? 'Next: open Claude Code in this project and run /slice:init'
      : 'Next: use .slice/commands/init.md as a prompt in your agent ($ARGUMENTS = your input).');
  }
} else {
  // uninstall: remove only the files Slice ships, never a whole directory tree.
  let cur = target;
  for (const part of rel) {
    cur = path.join(cur, part);
    const s = lstatOrNull(cur);
    if (!s) { console.log(`Nothing to remove: ${rel.join('/')}/ does not exist.`); process.exit(0); }
    if (s.isSymbolicLink() || !s.isDirectory()) fail(`refusing to remove through ${cur}`);
  }
  let removed = 0;
  for (const e of shippedFiles(path.join(PKG, 'commands'))) {
    if (!e.isFile()) continue;
    const f = path.join(commandsDir, e.name);
    const s = lstatOrNull(f);
    if (s && (s.isFile() || s.isSymbolicLink())) { fs.unlinkSync(f); removed++; }
  }
  try { fs.rmdirSync(commandsDir); } catch { /* not empty: keep the user's own files */ }
  console.log(`Removed ${removed} Slice command(s) from ${rel.join('/')}/. .slice/ was kept (it is your project's documentation).`);
}
