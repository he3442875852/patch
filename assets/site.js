(function () {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const quoteSection = document.querySelector('#quote');
  const mobileQuote = document.querySelector('[data-mobile-quote]');
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'ai', 'svg', 'eps'];
  const maxFileSize = 8 * 1024 * 1024;
  let lastSubmitAt = 0;

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
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
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

  function setStatus(form, message, type) {
    const status = form.querySelector('.form-status');
    if (!status) return;
    status.textContent = message;
    status.classList.remove('is-success', 'is-error');
    if (type) status.classList.add(`is-${type}`);
  }

  function updateFileName(input) {
    const form = input.closest('form');
    const nameTarget = form ? form.querySelector('[data-file-name]') : document.querySelector('[data-file-name]');
    const file = input.files && input.files[0];
    if (nameTarget) nameTarget.textContent = file ? file.name : 'No file selected';
  }

  function validate(form) {
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    if (!String(data.get('name') || '').trim() || !email) return 'Please complete your name and email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (!String(data.get('country') || '').trim()) return 'Please enter your country.';
    if (!String(data.get('patchType') || '').trim()) return 'Please select a patch type.';
    if (!String(data.get('quantity') || '').trim()) return 'Please enter the quantity.';

    const neededDate = String(data.get('neededDate') || '').trim();
    if (neededDate && !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(neededDate)) return 'Please enter the needed date as YYYY-MM-DD.';

    const file = data.get('artwork');
    if (file && file.name) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) return 'Please upload JPG, JPEG, PNG, PDF, AI, SVG or EPS artwork.';
      if (file.size > maxFileSize) return 'Artwork file must be 8MB or smaller.';
    }
    return '';
  }

  async function submitForm(form) {
    const now = Date.now();
    if (now - lastSubmitAt < 5000) {
      setStatus(form, 'Please wait a few seconds before submitting again.', 'error');
      return;
    }
    const error = validate(form);
    if (error) {
      setStatus(form, error, 'error');
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    const originalText = button ? button.textContent : '';
    lastSubmitAt = now;
    if (button) {
      button.disabled = true;
      button.textContent = 'Submitting...';
    }
    setStatus(form, 'Submitting your project details...', '');
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to submit the quote request.');
      form.reset();
      const fileInput = form.querySelector('input[name="artwork"]');
      if (fileInput) updateFileName(fileInput);
      setStatus(form, 'Thank you. Your project details have been received. We will review your artwork and contact you by email.', 'success');
    } catch (err) {
      setStatus(form, err.message || 'Submission failed. Please try again later.', 'error');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  }

  document.querySelectorAll('.quote-form').forEach((form) => {
    const fileInput = form.querySelector('input[name="artwork"]');
    if (fileInput) {
      updateFileName(fileInput);
      fileInput.addEventListener('change', () => {
        updateFileName(fileInput);
        const error = validate(form);
        if (error && fileInput.files && fileInput.files.length) setStatus(form, error, 'error');
      });
    }
    form.addEventListener('reset', () => {
      window.setTimeout(() => {
        if (fileInput) updateFileName(fileInput);
        setStatus(form, '', '');
      }, 0);
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitForm(form);
    });
  });

  if (quoteSection && mobileQuote && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => mobileQuote.classList.toggle('is-hidden', entry.isIntersecting));
    }, { threshold: .16 });
    observer.observe(quoteSection);
  }
})();
