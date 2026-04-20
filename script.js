'use strict';

///////////////////////////////////////
// Modal window

/** @type {HTMLElement | null} */
const modal = document.querySelector('.modal');
/** @type {HTMLElement | null} */
const overlay = document.querySelector('.overlay');
/** @type {HTMLElement | null} */
const btnCloseModal = document.querySelector('.btn--close-modal');
/** @type {NodeListOf<HTMLElement>} */
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
/** @type {HTMLElement | null} */
const btnScrollTo = document.querySelector('.btn--scroll-to');
/** @type {HTMLElement | null} */
const section1 = document.querySelector('#section--1');
/** @type {HTMLElement | null} */
const navLink = document.querySelector('.nav__link');
/** @type {HTMLElement | null} */
const navLinks = document.querySelector('.nav__links');
/** @type {HTMLElement | null} */
const nav = document.querySelector('.nav');
/** @type {HTMLElement | null} */
const h1 = document.querySelector('h1');
/** @type {NodeListOf<HTMLElement>} */
const tabs = document.querySelectorAll('.operations__tab');
/**
 * @type {HTMLElement | null}
 */
const header = document.querySelector('.header');
/**
 * @type {HTMLElement | null}
 */
const tabsContainer = document.querySelector('.operations__tab-container');
/**
 * @type {NodeListOf<HTMLElement>}
 */
const tabsContent = document.querySelectorAll('.operations__content');
/**
 * @type {NodeListOf<HTMLElement>}
 */
const allSections = document.querySelectorAll('.section');
/**
 * @type {NodeListOf<HTMLElement>}
 */
const imgTargets = document.querySelectorAll('img[data-src]');
/**
 * @type {NodeListOf<HTMLElement>}
 */
const slides = document.querySelectorAll('.slide');
/**
 * @type {HTMLElement | null}
 */
const btnLeft = document.querySelector('.slider__btn--left');
/**
 * @type {HTMLElement | null}
 */
const btnRight = document.querySelector('.slider__btn--right');
/**
 * @type {HTMLElement | null}
 */
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', () =>
  section1.scrollIntoView({ behavior: 'smooth' }),
);

///////////////////////////////////////
// Page navigation

navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  const target = /** @type {HTMLElement} */ (e.target);
  if (target.classList.contains('nav__link')) {
    const id = /** @type {HTMLElement} */ target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = /** @type {HTMLElement | null} */ (
    /** @type {HTMLElement} */ (e.target).closest('.operations__tab')
  );

  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation

const handleHover = function (/** @type {MouseEvent} */ e) {
  if (/** @type {HTMLElement} */ (e.target).classList.contains('nav__link')) {
    const link = /** @type {HTMLElement} */ (e.target);
    const siblings = /** @type {NodeListOf<HTMLElement>} */ (
      link.closest('.nav').querySelectorAll('.nav__link')
    );
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(s => {
      if (s !== link) s.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind('0.5'));

nav.addEventListener('mouseout', handleHover.bind('1'));

// Sticky navigation

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   if (this.window.scrollY >= initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// const obsCallback = function () {};

// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (
  /** @type {IntersectionObserverEntry[]} */ entries,
) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections

const revealSection = function (
  /** @type {IntersectionObserverEntry[]} */ entries,
  /** @type {IntersectionObserver} */ observer,
) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy loading images

const loadImg = function (
  /** @type {IntersectionObserverEntry[]} */ entries,
  /** @type {IntersectionObserver} */ observer,
) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  const img = /** @type {HTMLImageElement} */ (entry.target);
  img.src = img.dataset.src;
  img.addEventListener('load', () => img.classList.remove('lazy-img'));
  observer.unobserve(img);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider

let curSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class='dots__dot' data-slide='${i}'></button>`,
    );
  });
};

const activateDot = function (/** @type {number} */ slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(d => d.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide='${slide}']`)
    .classList.add('dots__dot--active');
};

const goToSlide = function (/** @type {number} */ slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`),
  );
};

const init = function () {
  createDots();
  activateDot(0);
  goToSlide(0);
};
init();

const nextSlide = function () {
  if (curSlide === maxSlide - 1) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight?.addEventListener('click', nextSlide);

const prevSlide = function () {
  if (curSlide === 0) curSlide = maxSlide - 1;
  else curSlide--;

  goToSlide(curSlide);
  activateDot(curSlide);
};

btnLeft?.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (/** @type {HTMLElement} */ (e.target).classList.contains('dots__dot')) {
    curSlide = Number(/** @type {HTMLElement} */ (e.target).dataset.slide);
    goToSlide(curSlide);
    activateDot(curSlide);
  }
});
