/**
 * One-time readability pass for the imported Last5 stylesheets.
 *
 * The original files used many 8–11px labels, buttons and notes. This script
 * raises every small font-size to a readable minimum while preserving the
 * heading hierarchy and the larger display sizes.
 *
 * You can run it again safely: a marker comment is added after the first pass
 * and already-processed files are skipped.
 */
const fs = require('fs');
const path = require('path');

const MARKER = '/* last5-readability-v1 */';

const alpha = [
  [7, 12],
  [8.5, 12],
  [9.5, 12.5],
  [10.5, 13],
  [11.5, 13.5],
  [12.5, 14],
  [13.5, 14.5],
  [14.5, 15],
  [15.5, 16],
];

function mapSize(n) {
  for (const [max, size] of alpha) {
    if (n <= max) return size;
  }
  return n;
}

const cssDir = path.join(__dirname, '..', 'src', 'css');
const files = ['website.css', 'account-base.css', 'account.css', 'brand.css'];

for (const file of files) {
  const target = path.join(cssDir, file);
  const before = fs.readFileSync(target, 'utf8');
  if (before.includes(MARKER)) {
    console.log(file, 'already processed');
    continue;
  }
  const after = before.replace(/font-size:\s*([0-9.]+)px/g, (match, raw) => {
    const size = parseFloat(raw);
    if (size >= 16) return match;
    return `font-size: ${mapSize(size)}px`;
  });
  fs.writeFileSync(target, MARKER + '\n' + after);
  console.log(file, 'readability sizes applied');
}
