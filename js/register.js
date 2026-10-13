/* ==========================================================================
   REGISTRATION CONTROLLER
   Client-side registration with auto-login into dashboard.
   Validates inputs, hashes password via Web Crypto API, persists in localStorage,
   establishes active session, and navigates directly to dashboard.html.
   ========================================================================== */

(function () {
  'use strict';

  // If already authenticated, redirect directly to dashboard
  if (window.Auth && window.Auth.isAuthenticated()) {
    window.location.replace('dashboard.html');
    return;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.sheet-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const submitButton = document.getElementById('register-button');

    if (!form || !nameInput || !emailInput || !passwordInput || !confirmPasswordInput || !submitButton) {
      return;
    }

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

    // Attach error containers to each form row
    const nameError = createErrorElement('name-error');
    const emailError = createErrorElement('email-error');
    const passwordError = createErrorElement('password-error');
    const confirmPasswordError = createErrorElement('confirm-password-error');
    const formError = createErrorElement('register-form-error');

    nameInput.closest('.form-row').appendChild(nameError);
    emailInput.closest('.form-row').appendChild(emailError);
    passwordInput.closest('.form-row').appendChild(passwordError);
    confirmPasswordInput.closest('.form-row').appendChild(confirmPasswordError);

    // Form-level error placed right before submit button
    const formAction = form.querySelector('.form-action');
    if (formAction) {
      form.insertBefore(formError, formAction);
    }

    // Associate inputs with their error elements
    nameInput.setAttribute('aria-describedby', 'name-error');
    emailInput.setAttribute('aria-describedby', 'email-error');
    passwordInput.setAttribute('aria-describedby', 'password-error');
    confirmPasswordInput.setAttribute('aria-describedby', 'confirm-password-error');

    function showError(errorEl, inputEl, message) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      if (inputEl) {
        inputEl.classList.add('ink-input--error');
        inputEl.setAttribute('aria-invalid', 'true');
      }
    }

    function clearError(errorEl, inputEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
      if (inputEl) {
        inputEl.classList.remove('ink-input--error');
        inputEl.removeAttribute('aria-invalid');
      }
    }

    function clearAllErrors() {
      clearError(nameError, nameInput);
      clearError(emailError, emailInput);
      clearError(passwordError, passwordInput);
      clearError(confirmPasswordError, confirmPasswordInput);
      formError.textContent = '';
      formError.style.display = 'none';
    }

    // Clear field errors as user inputs corrections
    nameInput.addEventListener('input', function () {
      clearError(nameError, nameInput);
      formError.style.display = 'none';
    });
    emailInput.addEventListener('input', function () {
      clearError(emailError, emailInput);
      formError.style.display = 'none';
    });
    passwordInput.addEventListener('input', function () {
      clearError(passwordError, passwordInput);
      formError.style.display = 'none';
    });
    confirmPasswordInput.addEventListener('input', function () {
      clearError(confirmPasswordError, confirmPasswordInput);
      formError.style.display = 'none';
    });

    // Email format validator
    function isValidEmail(email) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      return emailRegex.test(email);
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (isSubmitting) return;

      clearAllErrors();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      let hasError = false;
      let firstErrorInput = null;

      // 1. Validate Name
      if (!name) {
        showError(nameError, nameInput, 'Please enter your full name.');
        hasError = true;
        firstErrorInput = firstErrorInput || nameInput;
      } else if (name.length < 2) {
        showError(nameError, nameInput, 'Name must be at least 2 characters.');
        hasError = true;
        firstErrorInput = firstErrorInput || nameInput;
      }

      // 2. Validate Email
      if (!email) {
        showError(emailError, emailInput, 'Please enter your email address.');
        hasError = true;
        firstErrorInput = firstErrorInput || emailInput;
      } else if (!isValidEmail(email)) {
        showError(emailError, emailInput, 'Please enter a valid email address (e.g. name@example.com).');
        hasError = true;
        firstErrorInput = firstErrorInput || emailInput;
      }

      // 3. Validate Password
      if (!password) {
        showError(passwordError, passwordInput, 'Please enter a password.');
        hasError = true;
        firstErrorInput = firstErrorInput || passwordInput;
      } else if (password.length < 6) {
        showError(passwordError, passwordInput, 'Password must be at least 6 characters in length.');
        hasError = true;
        firstErrorInput = firstErrorInput || passwordInput;
      }

      // 4. Validate Confirm Password
      if (!confirmPassword) {
        showError(confirmPasswordError, confirmPasswordInput, 'Please confirm your password.');
        hasError = true;
        firstErrorInput = firstErrorInput || confirmPasswordInput;
      } else if (password !== confirmPassword) {
        showError(confirmPasswordError, confirmPasswordInput, 'Passwords do not match. Please verify both entries.');
        hasError = true;
        firstErrorInput = firstErrorInput || confirmPasswordInput;
      }

      // 5. Check if email already registered
      if (!hasError && window.Auth && window.Auth.findUserByEmail(email)) {
        showError(emailError, emailInput, 'An account with this email address already exists. Please sign in.');
        hasError = true;
        firstErrorInput = firstErrorInput || emailInput;
      }

      if (hasError) {
        if (firstErrorInput) firstErrorInput.focus();
        return;
      }

      // Start submission process
      isSubmitting = true;
      submitButton.disabled = true;
      submitButton.classList.add('sheet-button--loading');
      const btnText = submitButton.querySelector('.btn-text');
      const originalText = btnText ? btnText.textContent : 'Create account';
      if (btnText) btnText.textContent = 'Creating account…';

      try {
        const result = await window.Auth.registerUser(name, email, password);

        if (!result.success) {
          formError.textContent = result.error || 'Failed to create account. Please try again.';
          formError.style.display = 'block';
          isSubmitting = false;
          submitButton.disabled = false;
          submitButton.classList.remove('sheet-button--loading');
          if (btnText) btnText.textContent = originalText;
          return;
        }

        // Automatic Login: Immediately start authenticated session
        window.Auth.createSession(result.user);

        // Redirect directly to the dashboard — newly registered user does not visit login again
        window.location.replace('dashboard.html');
      } catch (err) {
        console.error('Registration submission error:', err);
        formError.textContent = 'An unexpected error occurred during registration. Please try again.';
        formError.style.display = 'block';
        isSubmitting = false;
        submitButton.disabled = false;
        submitButton.classList.remove('sheet-button--loading');
        if (btnText) btnText.textContent = originalText;
      }
    });
  });
})();
