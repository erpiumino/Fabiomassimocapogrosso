// Definisci il tipo di ordinamento custom PRIMA di inizializzare la tabella
$.fn.dataTable.ext.type.detect.unshift(function(d) {
  if (d.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    return 'date-dmy';
  }
  return null;
});

$.fn.dataTable.ext.type.order['date-dmy-asc'] = function(a, b) {
  let dateA = a.split('/');
  let dateB = b.split('/');
  let da = new Date(dateA[2], dateA[1]-1, dateA[0]);
  let db = new Date(dateB[2], dateB[1]-1, dateB[0]);
  return da < db ? -1 : da > db ? 1 : 0;
};

$.fn.dataTable.ext.type.order['date-dmy-desc'] = function(a, b) {
  let dateA = a.split('/');
  let dateB = b.split('/');
  let da = new Date(dateA[2], dateA[1]-1, dateA[0]);
  let db = new Date(dateB[2], dateB[1]-1, dateB[0]);
  return da > db ? -1 : da < db ? 1 : 0;
};

document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#repertoire-body");
  
  if (!tableBody) return;

  const absolute = await fetch("absolute.json").then(r => r.json());

  // Estrai i tipi unici di composizione
  const compositionTypes = ['All', ...new Set(absolute.map(e => e.composition_type).filter(Boolean))];

  // Crea i bottoni filtro
  const filterContainer = document.createElement("div");
  filterContainer.className = "composition-filters";
  filterContainer.style.marginBottom = "20px";
  filterContainer.style.display = "flex";
  filterContainer.style.gap = "10px";
  filterContainer.style.flexWrap = "wrap";
  filterContainer.style.justifyContent = "center";

  compositionTypes.forEach(type => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = type;
    btn.dataset.filter = type;
    if (type === 'All') btn.classList.add('active');
    
    btn.style.padding = "8px 16px";
    btn.style.border = "2px solid var(--accent-color)";
    btn.style.borderRadius = "6px";
    btn.style.backgroundColor = "transparent";
    btn.style.color = "var(--accent-color)";
    btn.style.cursor = "pointer";
    btn.style.transition = "all 0.3s ease";
    
    btn.addEventListener("click", () => filterTable(type));
    filterContainer.appendChild(btn);
  });

  // Inserisci i filtri prima della tabella
  tableBody.parentElement.parentElement.insertBefore(filterContainer, tableBody.parentElement);

  function createRow(entry) {
      const premiereDate = entry.premiere_date 
        ? new Date(entry.premiere_date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        : '-';

      const nameCell = entry.url
        ? `<a href="${entry.url}" target="_blank" rel="noopener noreferrer">${entry.name}</a>`
        : entry.name;

      return `
        <tr data-composition-type="${entry.composition_type || ''}" data-premiere-date="${entry.premiere_date || ''}">
          <td class="name-cell">${nameCell}</td>
          <td class="type-cell">${entry.composition_type || '-'}</td>
          <td class="instrumentation-cell">${entry.instrumentation || '-'}</td>
          <td class="premiere-cell">${premiereDate}</td>
        </tr>
      `;
    }

  tableBody.innerHTML = absolute.map(createRow).join("");

  const table = $('#sortTable').DataTable({
    language: window.currentTexts || {},
    lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
    pageLength: 10,
    columnDefs: [
      { orderable: true, targets: [0, 3] },
      { orderable: false, targets: [1, 2] },
  {
    targets: 3,
    type: 'date-dmy'
  }
    ]
  });

  // Funzione per aggiungere chevron
  function updateChevrons() {
    document.querySelectorAll('.paginate_button.previous').forEach(btn => {
      btn.textContent = '‹';
    });
    document.querySelectorAll('.paginate_button.next').forEach(btn => {
      btn.textContent = '›';
    });
  }

  updateChevrons();
  table.on('draw', updateChevrons);

// Funzione per filtrare la tabella
function filterTable(type) {
  // Aggiorna stilo dei bottoni
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.backgroundColor = "transparent";
    btn.style.color = "var(--accent-color)";
  });

  document.querySelector(`[data-filter="${type}"]`).classList.add('active');
  document.querySelector(`[data-filter="${type}"]`).style.backgroundColor = "var(--accent-color)";
  document.querySelector(`[data-filter="${type}"]`).style.color = "white";

  // Resetta il search globale
  table.search('').columns().search('').draw();

  // Filtra SOLO la colonna composition_type (indice 1)
  if (type !== 'All') {
    table.column(1).search('^' + type + '$', true, false).draw();
  } else {
    table.draw();
  }
}
});