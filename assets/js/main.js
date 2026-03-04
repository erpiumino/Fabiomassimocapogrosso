/**
* Template Name: Day
* Template URL: https://bootstrapmade.com/day-multipurpose-html-template-for-free/
* Updated: May 18 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
AOS.init();

console.log('Before everything');


(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

/**
 * Mobile nav toggle
 */
const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
const sidebar = document.querySelector('#sidebar');
const overlay = document.querySelector('#overlay');
const en_btn = document.querySelector("#en-btn-sidebar");
const it_btn = document.querySelector("#it-btn-sidebar");

function mobileNavToggle() {
  document.body.classList.toggle('mobile-nav-active');
  sidebar.classList.toggle('sidebar-active');
  overlay.classList.toggle('overlay-active');
  mobileNavToggleBtn.classList.toggle('bi-list');
  mobileNavToggleBtn.classList.toggle('bi-x');
}
// Event listener for the mobile nav toggle button
mobileNavToggleBtn.addEventListener('click', mobileNavToggle);

// Event listener for the overlay and language buttons to close the sidebar when clicked
overlay.addEventListener('click', () => {
  if (document.body.classList.contains('mobile-nav-active')) {
    mobileNavToggle();
  }
});

en_btn.addEventListener('click', () => {
  if (document.body.classList.contains('mobile-nav-active')) {
    mobileNavToggle();
  }
});

it_btn.addEventListener('click', () => {
  if (document.body.classList.contains('mobile-nav-active')) {
    mobileNavToggle();
  }
});

/**
 * Hide mobile nav on same-page/hash links
 */
document.querySelectorAll('#navmenu a').forEach(navmenu => {
  navmenu.addEventListener('click', () => {
    if (document.body.classList.contains('mobile-nav-active')){
      mobileNavToggle();
    }
  });
});

/**
 * Toggle mobile nav dropdowns
 */
document.querySelectorAll('.navmenu .toggle-dropdown').forEach(dropdownToggle => {
  dropdownToggle.addEventListener('click', function(e) {
    if (document.body.classList.contains('mobile-nav-active')) {
      e.preventDefault();
      this.classList.toggle('active');
      this.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    }
  });
});


  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll('.swiper').forEach(function(swiper) {
      let config = JSON.parse(swiper.querySelector('.swiper-config').innerHTML.trim());
      new Swiper(swiper, config);
    });
  }
  window.addEventListener('load', initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);


  /**
   * Gallery Slider
   */
  new Swiper('.gallery-slider', {
    speed: 400,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      575: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20
      },
    }
  });

  /**
   * Initiate gallery lightbox 
   */
  const galleryLightbox = GLightbox({
    selector: '.gallery-lightbox'
  });

})();


function searchFunction() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}


/*Function to update meta viewport when Iphone is Tilted*/

function updateViewportMeta() {
  var metaViewport = document.getElementById('dynamic-viewport');
  if (window.matchMedia("(orientation: landscape)").matches) {
    metaViewport.setAttribute("content", "viewport-fit=cover");
  } else {
    metaViewport.setAttribute("content", "");
  }
}

// Aggiorna il meta tag all'avvio
updateViewportMeta();

// Aggiorna il meta tag quando cambia l'orientamento
window.addEventListener("orientationchange", updateViewportMeta);
window.addEventListener("resize", updateViewportMeta);



(function() {
  "use strict";

  // Verifica se l'utente sta usando un dispositivo mobile
  function isMobile() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/.test(navigator.userAgent);
  }

  // Funzione per aggiungere la classe 'visible' all'elemento se l'utente è su un dispositivo mobile
  function addVisibleClassIfMobile() {
    if (isMobile()) {
      const element = document.getElementById('repertoire-rotate');
      if (element) {
        element.classList.add('visible');
      } else {
        console.log('Element with id "repertoire-rotate" not found');
      }
    }
  }

  // Esegui l'aggiunta della classe al caricamento completo del DOM
  document.addEventListener('DOMContentLoaded', function() {
    addVisibleClassIfMobile();
  });

})();

/*
new DataTable('#sortTable', {
  sLengthMenu: [10, 25, 50, 75, 100]
});
*/