document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#speakers .container");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const itemsPerPage = 3;
  let allUpcomingEvents = [];
  let allPastEventsByYear = {};
  let currentUpcomingIndex = 0;
  let currentPastIndex = 0;
  let pastYearsToShow = [];
  let allPastEventsFlat = [];
  let pastEventsTitleShown = {};

  fetch("/events.json")
    .then(res => res.json())
    .then(data => {
      // Separa eventi futuri e passati
      const upcomingEvents = [];
      const pastEventsByYear = {};

      data.forEach(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        
        if (eventDate >= today) {
          upcomingEvents.push(event);
        } else {
          const year = eventDate.getFullYear();
          if (!pastEventsByYear[year]) {
            pastEventsByYear[year] = [];
          }
          pastEventsByYear[year].push(event);
        }
      });

      // Ordina eventi futuri per data crescente
      upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Ordina eventi passati per data decrescente (all'interno di ogni anno)
      Object.keys(pastEventsByYear).forEach(year => {
        pastEventsByYear[year].sort((a, b) => new Date(b.date) - new Date(a.date));
      });

      allUpcomingEvents = upcomingEvents;
      allPastEventsByYear = pastEventsByYear;
      pastYearsToShow = Object.keys(pastEventsByYear).sort().reverse();

      // Crea un array piatto di tutti gli eventi passati con i dati dell'anno
      pastYearsToShow.forEach(year => {
        pastEventsByYear[year].forEach(event => {
          allPastEventsFlat.push({
            ...event,
            year: year
          });
        });
      });

      // Carica i primi eventi
      loadMoreUpcomingEvents();

      // Se ci sono eventi passati, carica i primi
      if (allPastEventsFlat.length > 0) {
        loadMorePastEvents();
      }
    })
    .catch(err => console.error("Errore caricando gli eventi:", err));

  function loadMoreUpcomingEvents() {
    const eventsToAdd = allUpcomingEvents.slice(currentUpcomingIndex, currentUpcomingIndex + itemsPerPage);

    // Aggiungi il titolo "Upcoming Events" solo la prima volta
    if (currentUpcomingIndex === 0 && eventsToAdd.length > 0) {
      const upcomingTitle = document.createElement("div");
      upcomingTitle.className = "container section-title";
      upcomingTitle.innerHTML = "<h2>Upcoming Events</h2>";
      container.appendChild(upcomingTitle);
    }

    eventsToAdd.forEach(event => {
      container.appendChild(createEventRow(event));
    });

    currentUpcomingIndex += itemsPerPage;

    // Se ci sono altri eventi futuri, aggiungi il load more e ricrea il bottone
    if (currentUpcomingIndex < allUpcomingEvents.length) {
      addLoadMoreButtonUpcoming();
    }
  }

  function loadMorePastEvents() {
    const eventsToAdd = allPastEventsFlat.slice(currentPastIndex, currentPastIndex + itemsPerPage);

    eventsToAdd.forEach(event => {
      // Aggiungi il titolo dell'anno solo la prima volta che appare
      if (!pastEventsTitleShown[event.year]) {
        const yearTitle = document.createElement("div");
        yearTitle.className = "container section-title";
        yearTitle.innerHTML = `<h2 class="event-year">${event.year}</h2>`;
        container.appendChild(yearTitle);
        pastEventsTitleShown[event.year] = true;
      }

      container.appendChild(createEventRow(event));
    });

    currentPastIndex += itemsPerPage;

    // Se ci sono altri eventi passati, aggiungi il load more
    if (currentPastIndex < allPastEventsFlat.length) {
      addLoadMoreButtonPast();
    }
  }

  function addLoadMoreButtonUpcoming() {
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
      loadMoreUpcomingEvents();

      if (currentUpcomingIndex >= allUpcomingEvents.length) {
        loadMoreBtn.remove();
      } else {
        addLoadMoreButtonUpcoming();
      }
    });

    container.appendChild(loadMoreBtn);
  }

  function addLoadMoreButtonPast() {
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
      loadMorePastEvents();

      if (currentPastIndex >= allPastEventsFlat.length) {
        loadMoreBtn.remove();
      } else {
        addLoadMoreButtonPast();
      }
    });

    container.appendChild(loadMoreBtn);
  }
});

function createEventRow(event) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short'
  });

  const row = document.createElement("div");
  row.className = "row event";
  
  row.innerHTML = `
    <div class="col-sm-2">
      <h2>${formattedDate}</h2>
    </div>
    <div class="col-sm-2 event-title">
      <h3>${event.title}</h3>
    </div>
    <div class="mobile-info">
      <div class="col place">
        <p>${event.venue}</p>
        <p>${event.performers}</p>
      </div>
      <div class="col info-div">
        ${event.url ? `
          <a href="${event.url}" target="_blank" class="info">
            Info<i class="fa-solid fa-circle-arrow-right event-arrow"></i>
          </a>
        ` : `
          <span class="info">Info<i class="fa-solid fa-circle-arrow-right event-arrow"></i></span>
        `}
      </div>
    </div>
  `;
  
  return row;
}