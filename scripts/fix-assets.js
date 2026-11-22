const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '..', 'src', 'css');
for (const file of ['website.css', 'account-base.css', 'account.css', 'brand.css']) {
  const target = path.join(cssDir, file);
  let text = fs.readFileSync(target, 'utf8');
  text = text.split('../assets/').join('/assets/').split('./assets/').join('/assets/');
  fs.writeFileSync(target, text);
  console.log(file, 'asset paths point to /assets/');
}
