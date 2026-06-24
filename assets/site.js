(function () {
  const forms = document.querySelectorAll('form#quoteForm');
  if (!forms.length) return;

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'ai', 'svg', 'eps'];
  const maxFileSize = 8 * 1024 * 1024;
  let lastSubmitAt = 0;

  function setStatus(form, message, type) {
    let status = form.querySelector('.form-status') || form.querySelector('[role="status"]');
    if (!status) {
      status = document.createElement('p');
      status.className = 'form-status full';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      form.appendChild(status);
    }
    status.textContent = message;
    status.classList.remove('is-success', 'is-error');
    if (type) status.classList.add(`is-${type}`);
  }

  function validate(form) {
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    if (!String(data.get('name') || '').trim() || !email) return 'Please complete your name and email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (form.elements.country && form.elements.country.required && !String(data.get('country') || '').trim()) return 'Please enter your country.';
    if (form.elements.quantity && form.elements.quantity.required && !String(data.get('quantity') || '').trim()) return 'Please enter the quantity.';
    if (form.elements.patchType && form.elements.patchType.required && !String(data.get('patchType') || '').trim()) return 'Please select a patch type.';

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
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to submit the quote request.');
      form.reset();
      setStatus(form, 'Thank you. Your project details have been received. We’ll review your artwork and contact you by email.', 'success');
    } catch (err) {
      setStatus(form, err.message || 'Submission failed. Please try again later.', 'error');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  }

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitForm(form);
    });
  });
})();
