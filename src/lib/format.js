export const money = (n) =>
  '৳' + new Intl.NumberFormat('en-BD', { maximumFractionDigits: 2 }).format((n || 0) / 100);

export const accountMoney = (n, d = false) =>
  '৳' +
  (n / 100).toLocaleString('en-BD', {
    minimumFractionDigits: d || n % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  });

export const initials = (x) =>
  String(x || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

export const shortDate = (d) =>
  new Date(d + 'T12:00:00+06:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });

export const date = (d, opts = { day: 'numeric', month: 'short' }) =>
  new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', opts);

export const clock = (t, upper = false) => {
  const [h, m] = t.split(':').map(Number);
  return (
    (h % 12 || 12) +
    (m ? ':' + String(m).padStart(2, '0') : '') +
    (h >= 12 ? (upper ? ' PM' : ' pm') : upper ? ' AM' : ' am')
  );
};

export const uid = (p) => p + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);

export const pic = (name = 'bread') => `/assets/${name || 'bread'}.jpg`;

export const vegetarian = (f) => !['F2', 'F7', 'F16'].includes(f.id);
export const vegan = (f) => ['F9', 'F15', 'F17'].includes(f.id);
