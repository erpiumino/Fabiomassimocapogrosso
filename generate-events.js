const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const eventsDir = path.join(__dirname, 'events');
const outputFile = path.join(__dirname, 'events.json');

const events = [];

// Legge tutti i file .md nella cartella events/
fs.readdirSync(eventsDir).forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(eventsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);

    events.push({
      title: data.title || '',
      description: data.description || '',
      description_en: data.description_en || '',  // nuovo campo per inglese
      pubDate: data.pubDate || '',
      place: data.place || '',
      url: data.url || '',
      heroImage: data.heroImage || '',
      tickets: data.tickets || ''
    });
  }
});

// Ordina per data crescente
events.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));

// Scrive il JSON
fs.writeFileSync(outputFile, JSON.stringify(events, null, 2));
console.log(`Events JSON generato in ${outputFile}`);
