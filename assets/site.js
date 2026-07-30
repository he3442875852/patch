(function () {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
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
      if (event.target.closest('a') && window.matchMedia('(max-width: 900px)').matches) {
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

  document.querySelectorAll('input[type="file"]').forEach((input) => {
    input.addEventListener('change', () => {
      const form = input.closest('form');
      const nameTarget = form ? form.querySelector('[data-file-name]') : null;
      const file = input.files && input.files[0];
      if (nameTarget) nameTarget.textContent = file ? file.name : 'No file selected';
    });
  });

  function setStatus(form, message, type) {
    const status = form.querySelector('.form-status');
    if (!status) return;
    status.textContent = message;
    status.classList.remove('is-success', 'is-error');
    if (type) status.classList.add(`is-${type}`);
  }

  function validate(form) {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const contact = String(data.get('email') || '').trim();
    const quantity = String(data.get('quantity') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !contact || !quantity || !message) return 'Please complete name, email or WhatsApp, quantity and message.';
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const looksLikePhone = /^[+()\d\s.-]{7,}$/.test(contact);
    if (!looksLikeEmail && !looksLikePhone) return 'Please enter a valid email address or WhatsApp number.';

    const neededDate = String(data.get('neededDate') || '').trim();
    if (neededDate && !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(neededDate)) return 'Please enter the deadline as YYYY-MM-DD.';

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
      if (!response.ok || result.ok === false) throw new Error(result.error || 'Submission failed.');
      form.reset();
      const nameTarget = form.querySelector('[data-file-name]');
      if (nameTarget) nameTarget.textContent = 'No file selected';
      setStatus(form, 'Thanks. Your request has been sent.', 'success');
    } catch (error) {
      setStatus(form, `${error.message} Please try again or use the WhatsApp button.`, 'error');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  }

  document.querySelectorAll('#quoteForm').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitForm(form);
    });
  });
})();
