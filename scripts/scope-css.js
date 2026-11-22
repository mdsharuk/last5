/**
 * One-time helper that scoped the original Last5 stylesheets to the React
 * wrappers (`.public-app` and `.account-app`).
 *
 * The files in src/css are now the editable source of truth. Running this
 * script again would double-prefix them, so it is guarded and does nothing
 * when the files are already scoped.
 *
 * If you ever want to re-import the original CSS, copy the unmodified files
 * from Last5_Deal_HTML_Source/dist into src/css first, then run:
 *   node scripts/scope-css.js && node scripts/fix-assets.js
 */
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const cssDir = path.join(__dirname, '..', 'src', 'css');

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

function scopeSelector(selector, prefix) {
  if (selector.startsWith('@')) return selector;
  if (selector === '*' || selector === '::before' || selector === '::after') return selector;
  if (selector === ':root' || selector === 'html' || selector === 'body') return prefix;
  if (selector.startsWith('body.')) return prefix + selector.slice(4);
  if (selector.startsWith('html ')) return prefix + selector.slice(4);
  if (selector.startsWith('body ')) return prefix + selector.slice(4);
  if (selector.startsWith(':root ')) return prefix + selector.slice(5);
  return prefix + ' ' + selector;
}

function plugin(prefix) {
  return {
    postcssPlugin: 'scope-to-wrapper',
    Once(root) {
      root.walkRules((rule) => {
        if (rule.parent && rule.parent.type === 'atrule' && /keyframes/i.test(rule.parent.name)) return;
        if (rule.selector.startsWith('@')) return;
        rule.selector = splitSelectors(rule.selector)
          .map((s) => scopeSelector(s, prefix))
          .join(', ');
      });
    },
  };
}

function run(file, prefix) {
  const target = path.join(cssDir, file);
  const input = fs.readFileSync(target, 'utf8');
  if (input.includes(prefix)) {
    console.log(file, 'already scoped - skipped');
    return;
  }
  const result = postcss([plugin(prefix)]).process(input, { from: file, to: file });
  fs.writeFileSync(target, result.css);
  console.log(file, 'scoped to', prefix);
}

run('website.css', '.public-app');
run('account-base.css', '.account-app');
run('account.css', '.account-app');
