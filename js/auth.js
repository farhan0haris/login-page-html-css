/* ==========================================================================
   AUTHENTICATION & SESSION MODULE (SHARED)
   Client-side demonstration authentication with Web Crypto API hashing.
   In a production application, authentication, hashing, and authorization
   must always be executed by a secure backend server.
   ========================================================================== */

(function () {
  'use strict';

  // Constants
  const STORAGE_KEY = 'parchment_registered_users';
  const SESSION_KEY = 'isLoggedIn';
  const SESSION_USER_KEY = 'sessionUser';
  const SESSION_NAME_KEY = 'sessionName';

  // Default administrator test credentials (always functional)
  const ADMIN_CREDENTIALS = {
    email: 'admin@gmail.com',
    password: 'Admin@123',
    name: 'Admin'
  };

  /**
   * Hashes a password using the browser's Web Crypto API (SHA-256)
   * with salt. Provides a fallback if Web Crypto is unavailable.
   * @param {string} password
   * @returns {Promise<string>}
   */
  async function hashPassword(password) {
    const salt = 'folio_salt_victorian_2026';
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + '::' + salt);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(function (b) {
          return b.toString(16).padStart(2, '0');
        }).join('');
      } catch (err) {
        console.warn('Web Crypto API failed, using fallback hash:', err);
      }
    }

    // Graceful deterministic fallback for environments lacking SubtleCrypto
    let hash = 0;
    const combined = password + '::' + salt;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }

  /**
   * Retrieves all registered accounts from localStorage.
   * @returns {Array<{name: string, email: string, passwordHash: string, registeredAt: string}>}
   */
  function getRegisteredUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error reading registered users from localStorage:', e);
      return [];
    }
  }

  /**
   * Persists the list of registered users to localStorage.
   * @param {Array} users
   */
  function saveRegisteredUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error writing registered users to localStorage:', e);
    }
  }

  /**
   * Finds a user by email (case-insensitive) across Admin and registered users.
   * @param {string} email
   * @returns {object|null}
   */
  function findUserByEmail(email) {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();

    // Check Administrator
    if (normalized === ADMIN_CREDENTIALS.email.toLowerCase()) {
      return {
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        isAdmin: true
      };
    }

    // Check registered accounts
    const users = getRegisteredUsers();
    const found = users.find(function (u) {
      return u.email && u.email.toLowerCase() === normalized;
    });

    return found || null;
  }

  /**
   * Authenticates user with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object|null>} user object or null
   */
  async function authenticate(email, password) {
    if (!email || !password) return null;
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check Administrator credentials
    if (normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
      return {
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        isAdmin: true
      };
    }

    // 2. Check registered accounts with password hash
    const users = getRegisteredUsers();
    const user = users.find(function (u) {
      return u.email && u.email.toLowerCase() === normalizedEmail;
    });

    if (!user) return null;

    const inputHash = await hashPassword(password);
    if (user.passwordHash === inputHash) {
      return {
        email: user.email,
        name: user.name,
        isAdmin: false
      };
    }

    return null;
  }

  /**
   * Registers a new account and persists it in localStorage.
   * Password is never stored in raw text; only its cryptographic hash is stored.
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  async function registerUser(name, email, password) {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, error: 'All fields are required.' };
    }

    // Check if account already exists
    if (findUserByEmail(cleanEmail)) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.'
      };
    }

    try {
      const passwordHash = await hashPassword(password);
      const newUser = {
        name: cleanName,
        email: cleanEmail,
        passwordHash: passwordHash,
        registeredAt: new Date().toISOString()
      };

      const users = getRegisteredUsers();
      users.push(newUser);
      saveRegisteredUsers(users);

      return {
        success: true,
        user: {
          name: newUser.name,
          email: newUser.email,
          isAdmin: false
        }
      };
    } catch (e) {
      console.error('Registration failed:', e);
      return {
        success: false,
        error: 'Registration failed due to an unexpected error. Please try again.'
      };
    }
  }

  /**
   * Sets up an authenticated session in sessionStorage.
   * @param {object} user
   */
  function createSession(user) {
    if (!user) return;
    sessionStorage.setItem(SESSION_KEY, 'true');
    sessionStorage.setItem(SESSION_USER_KEY, user.email || '');
    sessionStorage.setItem(SESSION_NAME_KEY, user.name || (user.email ? user.email.split('@')[0] : 'User'));
  }

  /**
   * Clears the active session.
   */
  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
    sessionStorage.removeItem(SESSION_NAME_KEY);
    sessionStorage.clear();
  }

  /**
   * Returns whether a valid session is currently stored.
   * @returns {boolean}
   */
  function isAuthenticated() {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  }

  /**
   * Returns display info for the currently logged-in user.
   * @returns {object|null}
   */
  function getCurrentUser() {
    if (!isAuthenticated()) return null;
    return {
      email: sessionStorage.getItem(SESSION_USER_KEY) || '',
      name: sessionStorage.getItem(SESSION_NAME_KEY) || ''
    };
  }

  // Expose API to window namespace
  window.Auth = {
    ADMIN_CREDENTIALS: ADMIN_CREDENTIALS,
    hashPassword: hashPassword,
    getRegisteredUsers: getRegisteredUsers,
    findUserByEmail: findUserByEmail,
    authenticate: authenticate,
    registerUser: registerUser,
    createSession: createSession,
    clearSession: clearSession,
    isAuthenticated: isAuthenticated,
    getCurrentUser: getCurrentUser,
    SESSION_KEY: SESSION_KEY,
    SESSION_USER_KEY: SESSION_USER_KEY,
    SESSION_NAME_KEY: SESSION_NAME_KEY
  };
})();
