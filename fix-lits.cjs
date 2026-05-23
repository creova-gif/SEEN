const fs = require('fs');
const files = [
  'src/app/data/season3Story1Diaspora.ts',
  'src/app/data/season4Story1YouthVoices.ts'
];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/'warm'/g, "'intimate'");
  content = content.replace(/"warm"/g, '"intimate"');
  content = content.replace(/'hopeful'/g, "'celebratory'");
  content = content.replace(/"hopeful"/g, '"celebratory"');
  fs.writeFileSync(file, content);
}
console.log('Fixed literals');
