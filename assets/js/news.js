document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("news-grid");
  const MAX_NEWS = 10;

  fetch("news.json")
    .then(res => res.json())
    .then(data => {
      // ordina per data decrescente
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      data.slice(0, MAX_NEWS).forEach(article => {
        const card = document.createElement("article");
        const cardSize = (article.size && typeof article.size === 'object') ? article.size.value : article.size;
        card.className = `news-card ${cardSize || 'medium'}`;
        
        // rende tutta la card cliccabile
        if (article.url) {
          card.style.cursor = "pointer";
          card.addEventListener("click", () => {
            window.open(article.url, "_blank"); // apre in una nuova scheda
          });
        }

        card.innerHTML = `
          <img src="${article.cover}" loading="lazy" alt="${article.title}">
          <div class="news-content">
            <h3>${article.title}</h3>
            <p>${article.subtitle}</p>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => console.error("Errore caricando le news:", err));
});