const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '..', 'public');

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (/\.(jpe?g|png)$/i.test(file)) {
      const out = full.replace(/\.(jpe?g|png)$/i, '.webp');
      sharp(full)
        .toFormat('webp')
        .toFile(out)
        .catch(err => {
          console.error('Error converting', full, err);
        });
    }
  });
}

walk(inputDir);
console.log('Image optimization complete');
