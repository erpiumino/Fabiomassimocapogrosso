const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const newsDir = path.join(__dirname, 'news');
const outputFile = path.join(__dirname, 'news.json');

const news = [];

// Legge tutti i file .md nella cartella news/
fs.readdirSync(newsDir).forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(newsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);

    news.push({
      date: data.date || '',
      title: data.title || '',
      subtitle: data.subtitle || '',
      url: data.url || '',
      cover: data.cover || ''
    });
  }
});

// Ordina per data decrescente (più recenti prima)
news.sort((a, b) => new Date(b.date) - new Date(a.date));

// Scrive il JSON
fs.writeFileSync(outputFile, JSON.stringify(news, null, 2));

console.log(`News JSON generato in ${outputFile}`);