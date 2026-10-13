/* ==========================================================================
   LOGIN CONTROLLER
   Client-side authentication supporting Admin and registered accounts.
   In a production application, authentication must be verified by a backend server.
   ========================================================================== */

(function () {
  'use strict';

  // If already authenticated, redirect directly to dashboard
  if (sessionStorage.getItem('isLoggedIn') === 'true') {
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

    // Helper to create accessible error element
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

    function showError(element, inputEl, message) {
      element.textContent = message;
      element.style.display = 'block';
      if (inputEl) {
        inputEl.classList.add('ink-input--error');
        inputEl.setAttribute('aria-invalid', 'true');
      }
    }

    function clearError(element, inputEl) {
      element.textContent = '';
      element.style.display = 'none';
      if (inputEl) {
        inputEl.classList.remove('ink-input--error');
        inputEl.removeAttribute('aria-invalid');
      }
    }

    function clearAllErrors() {
      clearError(emailError, emailInput);
      clearError(passwordError, passwordInput);
      formError.textContent = '';
      formError.style.display = 'none';
    }

    // Clear individual field errors on input
    emailInput.addEventListener('input', function () {
      clearError(emailError, emailInput);
      formError.style.display = 'none';
    });

    passwordInput.addEventListener('input', function () {
      clearError(passwordError, passwordInput);
      formError.style.display = 'none';
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (isSubmitting) return;

      clearAllErrors();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      let hasError = false;

      // Validate email
      if (!email) {
        showError(emailError, emailInput, 'Please enter your email address.');
        emailInput.focus();
        hasError = true;
      }

      // Validate password
      if (!password) {
        showError(passwordError, passwordInput, 'Please enter your password.');
        if (!hasError) passwordInput.focus();
        hasError = true;
      }

      if (hasError) return;

      // Prevent double submission
      isSubmitting = true;
      submitButton.disabled = true;
      submitButton.classList.add('sheet-button--loading');
      const btnText = submitButton.querySelector('.btn-text');
      const originalText = btnText ? btnText.textContent : 'Sign in';
      if (btnText) btnText.textContent = 'Signing in…';

      try {
        // Authenticate via window.Auth (supports Admin and registered accounts with Web Crypto hashing)
        let authenticatedUser = null;
        if (window.Auth && typeof window.Auth.authenticate === 'function') {
          authenticatedUser = await window.Auth.authenticate(email, password);
        } else {
          // Direct fallback if auth.js was somehow not loaded
          if (email === 'admin@gmail.com' && password === 'Admin@123') {
            authenticatedUser = { email: email, name: 'Admin', isAdmin: true };
          }
        }

        if (authenticatedUser) {
          // Success — establish session and redirect
          if (window.Auth && typeof window.Auth.createSession === 'function') {
            window.Auth.createSession(authenticatedUser);
          } else {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('sessionUser', authenticatedUser.email);
            sessionStorage.setItem('sessionName', authenticatedUser.name || 'Admin');
          }
          window.location.replace('dashboard.html');
        } else {
          // Failed authentication
          formError.textContent = 'Invalid email or password. Please try again.';
          formError.style.display = 'block';
          isSubmitting = false;
          submitButton.disabled = false;
          submitButton.classList.remove('sheet-button--loading');
          if (btnText) btnText.textContent = originalText;
          emailInput.focus();
        }
      } catch (err) {
        console.error('Authentication error:', err);
        formError.textContent = 'An error occurred during authentication. Please try again.';
        formError.style.display = 'block';
        isSubmitting = false;
        submitButton.disabled = false;
        submitButton.classList.remove('sheet-button--loading');
        if (btnText) btnText.textContent = originalText;
      }
    });
  });
})();
