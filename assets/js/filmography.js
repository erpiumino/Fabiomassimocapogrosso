document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("about-container");
  const itemsPerPage = 2; // Quanti film mostrare per volta
  let allFilms = [];
  let currentIndex = 0;

  fetch("/filmography.json")
    .then(res => res.json())
    .then(data => {
      // Ordina per anno decrescente (film più recenti prima)
      allFilms = data.sort((a, b) => b.year - a.year);

      // Mostra i primi film
      loadMoreFilms();

      // Aggiungi il bottone "Load More" se ci sono altri film
      if (allFilms.length > itemsPerPage) {
        addLoadMoreButton();
      }
    })
    .catch(err => console.error("Errore caricando la filmografia:", err));

  function loadMoreFilms() {
    const filmsToAdd = allFilms.slice(currentIndex, currentIndex + itemsPerPage);

    filmsToAdd.forEach(film => {
      const filmBox = document.createElement("div");
      filmBox.className = "film-box";
      filmBox.style.backgroundImage = `url('${film.poster}')`;
      filmBox.style.backgroundSize = "cover";
      filmBox.style.backgroundPosition = "center";

      filmBox.innerHTML = `
        <div class="film-content">
          <h2>${film.title}</h2>
          <h4>${film.director}</h4>
          <p>${film.year}</p>
        </div>
      `;

      container.appendChild(filmBox);
    });

    currentIndex += itemsPerPage;
  }

function addLoadMoreButton() {
  // Rimuovi il bottone vecchio se esiste
  const oldBtn = document.getElementById("load-more-btn");
  if (oldBtn) oldBtn.remove();

  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.id = "load-more-btn";
  loadMoreBtn.className = "load-more-btn";
  
  loadMoreBtn.innerHTML = `
    <i class="fa-solid fa-chevron-down"></i>
    <span class="load-more-text">Load More</span>
  `;

  loadMoreBtn.addEventListener("click", () => {
    loadMoreFilms();

    // Se non ci sono più film, nascondi il bottone
    if (currentIndex >= allFilms.length) {
      loadMoreBtn.remove();
    } else {
      // Ricrea il bottone in fondo
      addLoadMoreButton();
    }
  });

  container.appendChild(loadMoreBtn);
}
});