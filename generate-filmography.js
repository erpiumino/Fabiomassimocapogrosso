const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const filmographyDir = path.join(__dirname, 'filmography');
const outputFile = path.join(__dirname, 'filmography.json');
const films = [];

fs.readdirSync(filmographyDir).forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(filmographyDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    films.push({
      title: data.title || '',
      director: data.director || '',
      date: data.date || '',
      poster: data.poster || '',
      synopsis: data.synopsis || '',
      trailer_url: data.trailer_url || '',
      spotify_key: data.spotify_key || ''
    });
  }
});

// Ordina per data decrescente (film più recenti prima)
films.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(outputFile, JSON.stringify(films, null, 2));
console.log(`Filmography JSON generato in ${outputFile}`);