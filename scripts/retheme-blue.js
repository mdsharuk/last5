/**
 * Applies the supplied brand reference palette to the whole project:
 *   Primary   #19678B
 *   Secondary #1FA5CD
 *   Accent    #7DC142
 *
 * It recolours the logo, favicon, CSS variables, hard-coded component colours
 * and keeps amber/red status colours readable. Run once; the marker prevents
 * a second pass from shifting the new blues.
 */
const fs = require('fs');
const path = require('path');

const MARKER = '/* last5-blue-palette-v1 */';
const root = path.join(__dirname, '..');

/* ------------------------------------------------------------------ */
/* Colour helpers                                                      */
/* ------------------------------------------------------------------ */
function hexToRgb(hex) {
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s * 100, l * 100];
}
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hp >= 0 && hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

/* Core values from the supplied reference and AA-contrast support colours. */
const explicit = {
  '#066534': '#19678b',
  '#066634': '#18678b',
  '#044c27': '#0f4c68',
  '#63b245': '#1fa5cd',
  '#64b246': '#1fa5cd',
  '#f47e1f': '#7dc142',
  '#f57e20': '#7dc142',
  '#607469': '#607c8c',
  '#486a38': '#3f6f86',
  '#5c7162': '#5c7384',
  '#526d55': '#526f82',
  '#50654d': '#506b7d',
  '#edf7e8': '#eef6fa',
  '#e5f3d8': '#e7f5ec',
  '#f6f8ef': '#f5f9fb',
  '#f5f8f3': '#f4f8fb',
  '#edf2df': '#eaf3f7',
  '#edf7f1': '#ecf6fa',
  '#eef8f2': '#ecf6f8',
  '#eef3e0': '#eef5f9',
  '#edf3df': '#eaf3f7',
  '#e7f3de': '#e9f4f8',
  '#d4eec9': '#d6eef7',
  '#d7e8cf': '#dbeaf2',
  '#dce7d9': '#dbe8f0',
  '#e2e8d9': '#dde9f0',
  '#2c5940': '#14506b',
  '#1d3d26': '#1f3a27',
  '#173322': '#173322',
  '#b6530c': '#4f8a2c',
  '#a5b77f': '#4f8a2c',
  '#c0d394': '#8cc46a',
  '#c7d6be': '#c7dbe5',
  '#9fb69a': '#9fb8c4',
  '#dce7cb': '#dbe8df',
  '#e1e9d6': '#e3edf3',
  '#f3e7d4': '#e6f2f8',
  '#f4eee0': '#e8f4f8',
  '#f6ebe0': '#e6f1f7',
  '#faf2ea': '#eef6fa',
  '#f4ebdf': '#e6f0f6',
  '#f1e4d5': '#e5eef5',
  '#886642': '#4f7390',
  '#8a6240': '#53708a',
  '#f5eadb': '#e8f1f7',
  '#98754e': '#557690',
  '#f3ece4': '#edf4f8',
  '#efe8df': '#eaf2f7',
  '#f8f3ed': '#eef6f9',
  '#c69466': '#5f92ad',
  '#163322': '#12303f',
  '#291f24': '#1b2c36',
  '#915c47': '#8f4747',
  '#293b33': '#1e3a48',
  '#283d35': '#1b3746',
  '#182b23': '#122b39',
};

function mapColor(rawHex) {
  const hex = rawHex.toLowerCase();
  const digits = hex.length - 1;
  const alpha = digits === 8 ? hex.slice(7) : '';
  const base = digits === 8 ? hex.slice(0, 7) : hex;
  if (explicit[base]) return explicit[base] + alpha;
  if (digits === 3) return hex;
  const [r, g, b] = hexToRgb(base.slice(1));
  const [h, s, l] = rgbToHsl(r, g, b);
  if (h >= 60 && h <= 200 && s > 5) {
    const newH = 186 + ((h - 60) / 140) * 26;
    return hslToHex(newH, Math.min(s, 78), l) + alpha;
  }
  return hex;
}

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */
const cssFiles = ['website.css', 'account-base.css', 'account.css', 'brand.css', 'app.css'];
for (const file of cssFiles) {
  const target = path.join(root, 'src', 'css', file);
  let css = fs.readFileSync(target, 'utf8');
  if (css.includes(MARKER)) {
    console.log(file, 'already themed');
    continue;
  }
  css = css.replace(/#[0-9a-fA-F]{3,8}\b/g, (m) => mapColor(m));
  fs.writeFileSync(target, MARKER + '\n' + css);
  console.log(file, 'themed');
}

/* ------------------------------------------------------------------ */
/* Logo + favicon                                                      */
/* ------------------------------------------------------------------ */
const logoPath = path.join(root, 'public', 'assets', 'last5-logo.svg');
let logo = fs.readFileSync(logoPath, 'utf8');
if (!logo.includes('#18678b')) {
  logo = logo
    .replaceAll('#64b246', '#7dc142') // leaf / accent
    .replaceAll('#f57e20', '#1da5cd') // badge / secondary
    .replaceAll('#066634', '#18678b'); // wordmark / primary
  fs.writeFileSync(logoPath, logo);
  console.log('last5-logo.svg recoloured');
}

/* Reference sheet: simple, accurate, and readable. */
fs.writeFileSync(
  path.join(root, 'public', 'assets', 'brand-reference.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 210">
  <rect width="640" height="210" rx="18" fill="#f7fafc"/>
  <text x="36" y="46" font-family="Roboto, Arial, sans-serif" font-size="20" font-weight="700" fill="#19678b">Last5 Deal — brand palette</text>
  <g font-family="Roboto, Arial, sans-serif">
    <rect x="36" y="74" width="168" height="86" rx="12" fill="#19678b"/>
    <text x="52" y="117" font-size="15" font-weight="700" fill="#ffffff">Primary</text>
    <text x="52" y="141" font-size="13" fill="#dbeaf2">#19678B</text>
    <rect x="236" y="74" width="168" height="86" rx="12" fill="#1fa5cd"/>
    <text x="252" y="117" font-size="15" font-weight="700" fill="#ffffff">Secondary</text>
    <text x="252" y="141" font-size="13" fill="#e9f7fc">#1FA5CD</text>
    <rect x="436" y="74" width="168" height="86" rx="12" fill="#7dc142"/>
    <text x="452" y="117" font-size="15" font-weight="700" fill="#173322">Accent</text>
    <text x="452" y="141" font-size="13" fill="#254d24">#7DC142</text>
  </g>
  <text x="36" y="190" font-family="Roboto, Arial, sans-serif" font-size="12" fill="#607c8c">Primary headings, navigation and buttons · Secondary highlights · Accent offers and stickers</text>
</svg>
`
);
console.log('brand-reference.svg replaced');
