/* ==========================================================================
   LOGIN AUTHENTICATION
   Client-side demo authentication — NOT for production use.
   In a real application, authentication and authorization must be
   enforced by a backend server. Credentials should never be stored
   or validated on the client side.
   ========================================================================== */

(function () {
  'use strict';

  // Demo credentials
  const DEMO_EMAIL = 'admin@gmail.com';
  const DEMO_PASSWORD = 'Admin@123';
  const SESSION_KEY = 'isLoggedIn';
  const SESSION_USER_KEY = 'sessionUser';

  // If already logged in, redirect to dashboard
  if (sessionStorage.getItem(SESSION_KEY) === 'true') {
    window.location.replace('dashboard.html');
    return;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.sheet-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('signin-button');

    if (!form || !emailInput || !passwordInput || !submitButton) return;

    let isSubmitting = false;

    // Create error message element
    function createErrorElement(id) {
      const el = document.createElement('p');
      el.id = id;
      el.className = 'form-error-message';
      el.setAttribute('role', 'alert');
      el.setAttribute('aria-live', 'assertive');
      el.style.display = 'none';
      return el;
    }

    // Insert field-level error elements after each input wrapper
    const emailError = createErrorElement('email-error');
    const passwordError = createErrorElement('password-error');
    const formError = createErrorElement('form-error');

    emailInput.closest('.form-row').appendChild(emailError);
    passwordInput.closest('.form-row').appendChild(passwordError);

    // Insert form-level error before the submit button
    const formAction = form.querySelector('.form-action');
    if (formAction) {
      form.insertBefore(formError, formAction);
    }

    // Link inputs to their error messages via aria-describedby
    emailInput.setAttribute('aria-describedby', 'email-error');
    passwordInput.setAttribute('aria-describedby', 'password-error');

    function showError(element, message) {
      element.textContent = message;
      element.style.display = 'block';
      // Add error styling to the associated input
      const row = element.closest('.form-row');
      if (row) {
        const input = row.querySelector('.ink-input');
        if (input) input.classList.add('ink-input--error');
      }
    }

    function clearError(element) {
      element.textContent = '';
      element.style.display = 'none';
      const row = element.closest('.form-row');
      if (row) {
        const input = row.querySelector('.ink-input');
        if (input) input.classList.remove('ink-input--error');
      }
    }

    function clearAllErrors() {
      clearError(emailError);
      clearError(passwordError);
      clearError(formError);
    }

    // Clear individual field errors on input
    emailInput.addEventListener('input', function () {
      clearError(emailError);
      clearError(formError);
    });

    passwordInput.addEventListener('input', function () {
      clearError(passwordError);
      clearError(formError);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (isSubmitting) return;

      clearAllErrors();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      let hasError = false;

      // Validate email
      if (!email) {
        showError(emailError, 'Please enter your email address.');
        emailInput.focus();
        hasError = true;
      }

      // Validate password
      if (!password) {
        showError(passwordError, 'Please enter your password.');
        if (!hasError) passwordInput.focus();
        hasError = true;
      }

      if (hasError) return;

      // Prevent double submission
      isSubmitting = true;
      submitButton.disabled = true;
      submitButton.classList.add('sheet-button--loading');
      const btnText = submitButton.querySelector('.btn-text');
      const originalText = btnText ? btnText.textContent : '';
      if (btnText) btnText.textContent = 'Signing in…';

      // Simulate brief authentication delay for UX
      setTimeout(function () {
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          // Success — set session and redirect
          sessionStorage.setItem(SESSION_KEY, 'true');
          sessionStorage.setItem(SESSION_USER_KEY, email);
          window.location.replace('dashboard.html');
        } else {
          // Failed authentication
          showError(formError, 'Invalid email or password. Please try again.');
          isSubmitting = false;
          submitButton.disabled = false;
          submitButton.classList.remove('sheet-button--loading');
          if (btnText) btnText.textContent = originalText;
          emailInput.focus();
        }
      }, 600);
    });
  });
})();
