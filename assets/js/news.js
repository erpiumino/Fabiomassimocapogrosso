document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("news-grid");
  const MAX_NEWS = 10;

  fetch("/news.json")
    .then(res => res.json())
    .then(data => {
      data.sort((a,b) => new Date(b.date) - new Date(a.date));
      data.slice(0, MAX_NEWS).forEach(article => {
        const card = document.createElement("article");
        card.className = "news-card medium";
        card.innerHTML = `
          <img src="${article.cover}" loading="lazy" alt="${article.title}">
          <div class="news-content">
            <h3>${article.title}</h3>
            <p>${article.subtitle}</p>
            ${article.url ? `<a href="${article.url}" target="_blank">Leggi di più</a>` : ''}
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => console.error("Errore caricando le news:", err));
});