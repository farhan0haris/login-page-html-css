/* ==========================================================================
   DASHBOARD SESSION PROTECTION & LOGOUT
   Client-side demo session management — NOT for production use.
   In a real application, session validation must be handled by a
   backend server with proper token-based authentication.
   ========================================================================== */

(function () {
  'use strict';

  const SESSION_KEY = 'isLoggedIn';
  const SESSION_USER_KEY = 'sessionUser';

  // ── Session Protection ──
  // Check immediately before any content is rendered
  function checkSession() {
    if (sessionStorage.getItem(SESSION_KEY) !== 'true') {
      window.location.replace('index.html');
      return false;
    }
    return true;
  }

  // Initial check — if not authenticated, redirect before DOM renders
  if (!checkSession()) return;

  // Handle back-forward cache (bfcache) restoration
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      // Page was restored from bfcache — recheck session
      checkSession();
    }
  });

  // Also recheck when the page regains visibility (tab switch)
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      checkSession();
    }
  });

  // ── Dashboard Logic ──
  document.addEventListener('DOMContentLoaded', function () {
    // Populate welcome message
    const welcomeEl = document.getElementById('dashboard-welcome');
    const userEmail = sessionStorage.getItem(SESSION_USER_KEY) || 'User';
    const displayName = userEmail.split('@')[0];
    // Capitalize first letter
    const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    if (welcomeEl) {
      welcomeEl.textContent = 'Welcome, ' + formattedName + '.';
    }

    // ── Logout ──
    const logoutButtons = document.querySelectorAll('[data-action="logout"]');
    logoutButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        performLogout();
      });
    });

    function performLogout() {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_USER_KEY);
      sessionStorage.clear();
      // Replace the current history entry so Back won't return here
      window.location.replace('index.html');
    }

    // ── Current Date/Time (Optional Enhancement) ──
    const dateEl = document.getElementById('dashboard-date');
    if (dateEl) {
      function updateDateTime() {
        const now = new Date();
        const options = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
      }
      updateDateTime();
      setInterval(updateDateTime, 30000); // Update every 30 seconds
    }

    // ── Search Users (Optional Enhancement) ──
    const searchInput = document.getElementById('user-search');
    const tableBody = document.getElementById('users-table-body');

    if (searchInput && tableBody) {
      searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase().trim();
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(function (row) {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }

    // ── Filter Users by Status (Optional Enhancement) ──
    const filterButtons = document.querySelectorAll('[data-filter]');
    if (filterButtons.length && tableBody) {
      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          // Toggle active state
          filterButtons.forEach(function (b) { b.classList.remove('filter-active'); });
          this.classList.add('filter-active');

          const filter = this.getAttribute('data-filter');
          const rows = tableBody.querySelectorAll('tr');

          rows.forEach(function (row) {
            if (filter === 'all') {
              row.style.display = '';
            } else {
              const statusCell = row.querySelector('.status-badge');
              if (statusCell) {
                const status = statusCell.textContent.toLowerCase().trim();
                row.style.display = status === filter ? '' : 'none';
              }
            }
          });
        });
      });
    }

    // Show the dashboard content (it starts hidden until session is verified)
    const dashboardContent = document.getElementById('dashboard-content');
    if (dashboardContent) {
      dashboardContent.style.visibility = 'visible';
      dashboardContent.style.opacity = '1';
    }
  });
})();
