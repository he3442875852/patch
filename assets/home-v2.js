(function () {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const quoteSection = document.querySelector('#quote');
  const mobileQuote = document.querySelector('[data-mobile-quote]');

  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    primaryNav.addEventListener('click', (event) => {
      if (event.target.closest('a') && window.matchMedia('(max-width: 920px)').matches) {
        primaryNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  if (tabs.length) {
    const activateTab = (tab) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(item.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      tab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        activateTab(tabs[nextIndex]);
      });
    });
  }

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = document.querySelector('[data-lightbox-close]');
  const gallery = document.querySelector('[data-lightbox-gallery]');

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.hidden = true;
    lightboxImage.removeAttribute('src');
    lightboxImage.removeAttribute('alt');
  }

  if (gallery && lightbox && lightboxImage) {
    gallery.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-full]');
      if (!button) return;
      const img = button.querySelector('img');
      lightboxImage.src = button.dataset.full;
      lightboxImage.alt = img ? img.alt : 'Custom patch preview';
      lightbox.hidden = false;
      if (lightboxClose) lightboxClose.focus();
    });
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLightbox();
    });
  }

  if (quoteSection && mobileQuote && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => mobileQuote.classList.toggle('is-hidden', entry.isIntersecting));
    }, { threshold: .16 });
    observer.observe(quoteSection);
  }
})();
