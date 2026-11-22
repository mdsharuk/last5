/**
 * brand.css is shared by both apps, so its selectors are duplicated for the
 * two wrappers. This keeps brand overrides at the same specificity as the
 * scoped app styles and lets the brand file (loaded last) win as intended.
 */
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const file = path.join(__dirname, '..', 'src', 'css', 'brand.css');
const input = fs.readFileSync(file, 'utf8');
if (input.includes('.public-app')) {
  console.log('brand.css already scoped - skipped');
  process.exit(0);
}

function splitSelectors(selector) {
  const out = [];
  let depth = 0;
  let current = '';
  for (const ch of selector) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      out.push(current.trim());
      current = '';
    } else current += ch;
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

const result = postcss([
  {
    postcssPlugin: 'brand-both-wrappers',
    Once(root) {
      root.walkRules((rule) => {
        if (rule.parent && rule.parent.type === 'atrule' && /keyframes/i.test(rule.parent.name)) return;
        if (rule.selector.startsWith('@')) return;
        const selectors = splitSelectors(rule.selector);
        const output = [];
        for (const selector of selectors) {
          if (selector === ':root' || selector === 'html' || selector === 'body') {
            output.push('.public-app', '.account-app');
          } else if (selector.startsWith('body.')) {
            output.push('.public-app' + selector.slice(4), '.account-app' + selector.slice(4));
          } else {
            output.push('.public-app ' + selector, '.account-app ' + selector);
          }
        }
        rule.selector = output.join(', ');
      });
    },
  },
]).process(input, { from: file, to: file });

fs.writeFileSync(file, result.css);
console.log('brand.css scoped to both wrappers');
