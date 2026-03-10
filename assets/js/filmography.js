document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("about-container");
  const itemsPerPage = 4;
  let allFilms = [];
  let currentIndex = 0;

  fetch("/filmography.json")
    .then(res => res.json())
    .then(data => {
      allFilms = data.sort((a, b) => b.year - a.year);

      loadMoreFilms();

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

      filmBox.addEventListener("click", () => {
        openFilmPage(film);
      });

      container.appendChild(filmBox);
    });

    currentIndex += itemsPerPage;
  }

  function addLoadMoreButton() {
    const oldBtn = document.getElementById("load-more-btn");
    if (oldBtn) oldBtn.remove();

    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.id = "load-more-btn";
    loadMoreBtn.className = "load-more-btn";
    
    loadMoreBtn.innerHTML = `
      <i class="fa-solid fa-chevron-down"></i>
      <span class="load-more-text">More</span>
    `;

    loadMoreBtn.addEventListener("click", () => {
      loadMoreFilms();

      if (currentIndex >= allFilms.length) {
        loadMoreBtn.remove();
      } else {
        addLoadMoreButton();
      }
    });

    container.appendChild(loadMoreBtn);
  }

  // FUNZIONI PER ESTRARRE GLI ID DAGLI URL
  function getYoutubeId(url) {
    if (!url) return null;
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  function getSpotifyId(url) {
    if (!url) return null;
    // Estrae l'ID sia da playlist che da album
    const regex = /spotify\.com\/(playlist|album)\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[2] : null;
  }

  function getSpotifyType(url) {
    if (!url) return null;
    // Ritorna se è 'playlist' o 'album'
    const regex = /spotify\.com\/(playlist|album)\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // FUNZIONE PER APRIRE LA PAGINA DEL FILM
  function openFilmPage(film) {
    const youtubeId = getYoutubeId(film.trailer_url);
    const spotifyId = getSpotifyId(film.spotifyUrl);

    const filmPage = `

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/main.css">

    <!-- Elemento di ancoraggio per l'header -->
    <header id="header" class="header fixed-top">
      <div class="branding d-flex align-items-center" id="desktop-menu">
        <div class="container position-relative d-flex align-items-center justify-content-between">
          <a href="index.html" class="logo d-flex align-items-center">
            <img src="assets/img/FMC bianco.png" href="#hero">
          </a>

          <nav id="navmenu" class="navmenu">
            <ul>
              <li><a href="about.html">Biography<i class="fa-solid fa-circle-arrow-right nav-arrow"></i></a></li>
              <li><a class="active">Filmography</a></li>
              <li><a href="absolute.html">Absolute Music<i class="fa-solid fa-circle-arrow-right nav-arrow"></i></a></li>
              <li><a href="events.html">Events<i class="fa-solid fa-circle-arrow-right nav-arrow"></i></a></li>
              <li><a href="press.html">Press<i class="fa-solid fa-circle-arrow-right nav-arrow"></i></a></li>
              <li><a href="contacts.html">Contact<i class="fa-solid fa-circle-arrow-right nav-arrow"></i></a></li>
            </ul>
            <i id="mobile-nav-toggle" class="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
        </div>
      </div>
    </header>

    <!--============================SideBar============================-->
    <div id="overlay" class="overlay"></div>
    <div id="sidebar" class="sidebar">
      <a href="index.html" class="logo d-flex align-items-center"> <img src="assets/img/FMC bianco.png" href="#hero"></a>
      <i class="bi bi-x sidebar-close"></i>

      <div class="d-flex flex-column flex-shrink-0 p-3" style="padding: 0!important; margin-top:50px;">
        <hr>
        <ul class="nav nav-pills flex-column mb-auto" id="sidebar-menu">
          <li class="nav-item"><a href="index.html">Home</a></li>
          <hr>
          <li class="nav-item"><a href="about.html">Biography</a></li>
          <hr>
          <li class="nav-item active"><a href="filmography.html">Filmography</a></li>
          <hr>
          <li class="nav-item"><a href="absolute.html">Absolute Music</a></li>
          <hr>
          <li class="nav-item"><a href="events.html">Events</a></li>
          <hr>
          <li class="nav-item"><a href="press.html">Press</a></li>
          <hr>
          <li class="nav-item"><a href="contacts.html">Contacts</a></li>
        </ul>
        <hr>
      </div>

      <div class="d-flex flex-column flex-shrink-0 p-3" style="padding: 0!important; margin-top:50px;">
        <ul class="nav nav-pills flex-column mb-auto nav-item-legal">
          <li><a>Terms & Conditions</a></li>
          <li><a>Privacy</a></li>
          <li><a>Credits</a></li>
        </ul>
      </div>
    </div>
    <!--============================SideBar============================-->

    <main class="main">
      <section id="speakers" class="portfolio">
        <div class="container">
          <div class="container" data-aos="fade-up" id="film-container">
            <div class="row row-film justify-content-between">

              <!-- PULSANTE BACK -->
              <div class="mt-5 mb-5 film-back">
                <a href='filmography.html' style="color:white;"><i class="fa-solid fa-chevron-left"></i>Back</a>
              </div>
              
              <div class="col-sm-5 film-col" data-aos="fade-up" data-aos-delay="200">
                <h2 style="color:white;" class="film-text-h2">${film.title}</h2>
                <p class="fst" style="font-weight: 10;">
                  <strong>Director:</strong> ${film.director}<br><br>
                  <strong>Year:</strong> ${film.year}<br><br>
                  <strong>Synopsis:</strong><br>
                  ${film.synopsis}
                </p>
              </div>
              <div class="col-sm-5" data-aos="fade-up" data-aos-delay="200" style="margin-top:auto; margin-bottom:auto;">
                <img loading="lazy" class="about-img film-img" src="${film.poster}" alt="${film.title}">
              </div>
            </div>
          </div>

          <!-- TRAILER YOUTUBE -->
          ${youtubeId ? `
          <div class="container mt-5">
                <h2 style="color:white;">Trailer</h2>
            <div class="ratio ratio-16x9 yt">
              <iframe src="https://www.youtube.com/embed/${youtubeId}" 
                title="YouTube video player" 
                allowfullscreen="" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                loading="lazy">
              </iframe>
            </div>
          </div>
          ` : ''}

          <!-- SOUNDTRACK SPOTIFY -->
          ${film.spotify_key ? `
          <div class="container mt-5">
            <h2 style="color:white;">Soundtrack</h2>
            ${film.spotify_key}
          </div>
          ` : ''}
        </div>
      </section>
    </main>

    <footer id="footer" class="footer position-relative">
      <div class="container footer-top">
        <div class="row gy-4">
          <div class="col-lg-4 col-md-3 footer-links footer-special">
            <a href="../index.html" class=" d-flex align-items-center logo">
              <img src="../assets/img/FMC bianco.png" href="#hero">
            </a>
            <h4 style="margin-top: 20px; margin-bottom: 0;">Fabio Massimo Capogrosso</h4>
            <span style="color: var(--accent-color); font-weight: 50;">Composer<br></span>
            <span style="font-size: 10px;">All rights reserved®<br>Designed and developed by <a href="https:www.riccardomordente.com" target="_blank" id="RM">Riccardo Mordente</a></span>
          </div>

          <div class="col-lg-3 col-md-3 footer-links">
            <h4 >Quick pages</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a class="active">Biography</a></li>
              <li><a href="team.html">Filmography</a></li>
              <li><a href="events.html">Absolute Music</a></li>
              <li><a href="contacts.html">Events</a></li>
              <li><a href="contacts.html">Press</a></li>
              <li><a href="contacts.html">Contacts</a></li>
            </ul>
          </div>

          <div class="col-lg-3 col-md-3 footer-links">
            <h4 >Helpful Links</h4>
            <ul>
              <li><a>Terms & Conditions</a></li>
              <li><a>Privacy</a></li>
              <li><a>Credits</a></li>
            </ul>
          </div>

          <div class="col-lg-2 col-md-3 footer-links">
            <h4>My Socials</h4>
            <ul>
              <li><a  href="Legal/Privacy.html">Facebook</a></li>
              <li><a  href="Legal/Copyright.html">Instagram</a></li>
              <li><a  href="Legal/Copyright.html">Twitter</a></li>
              <li><a  href="Legal/Credits.html">Youtube</a></li>
              <li><a  href="Legal/Credits.html">Soundcloud</a></li>
              <li><a  href="Legal/Credits.html">Spotify</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
    `;

    document.body.innerHTML = filmPage;
    initializeNavigation();
    window.scrollTo(0, 0);
  }

function initializeNavigation() {
  console.log("Inizializzando navigation...");
  
  const mobileNavToggle = document.getElementById("mobile-nav-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const sidebarClose = document.querySelector(".sidebar-close");

  console.log("mobileNavToggle:", mobileNavToggle);
  console.log("sidebar:", sidebar);
  console.log("sidebarClose:", sidebarClose);

  // Toggle mobile nav
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", () => {
      console.log("Toggle cliccato");
      sidebar.classList.add("sidebar-active"); // Cambiato da "active" a "sidebar-active"
      overlay.classList.add("overlay-active"); // Cambiato da "active" a "overlay-active"
    });
  }

  // Chiudi sidebar
  if (sidebarClose) {
    sidebarClose.addEventListener("click", () => {
      console.log("Close cliccato");
      sidebar.classList.remove("sidebar-active");
      overlay.classList.remove("overlay-active");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      console.log("Overlay cliccato");
      sidebar.classList.remove("sidebar-active");
      overlay.classList.remove("overlay-active");
    });
  }

  // Scroll header effect
  window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    if (header && window.scrollY > 100) {
      header.classList.add("scrolled");
    } else if (header) {
      header.classList.remove("scrolled");
    }
  });
}
}); // CHIUSURA DELL'EVENT LISTENER