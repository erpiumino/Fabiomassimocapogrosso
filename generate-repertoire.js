const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const repDir = path.join(__dirname, 'repertoire');
const outputFile = path.join(__dirname, 'repertoire.json');

const repertoire = [];

fs.readdirSync(repDir).forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(repDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);

    repertoire.push({
      title: data.title || '',
      composer: data.composer || '',
      year: data.year || '',
      link: data.link || '',

      organic_it: data.organic_it || '',
      organic_en: data.organic_en || '',

      notes_it: data.notes_it || '',
      notes_en: data.notes_en || ''
    });
  }
});

repertoire.sort((a, b) => Number(b.year) - Number(a.year));

fs.writeFileSync(outputFile, JSON.stringify(repertoire, null, 2));
console.log(`Repertoire JSON generato in ${outputFile}`);
