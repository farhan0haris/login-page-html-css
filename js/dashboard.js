/* ==========================================================================
   DASHBOARD CONTROLLER
   Session protection, administrative interactions, user search & filtering.
   ========================================================================== */

(function () {
  'use strict';

  // ── Session Gate ──
  function verifyActiveSession() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      window.location.replace('index.html');
      return false;
    }
    return true;
  }

  // Pre-render verification
  if (!verifyActiveSession()) return;

  // Re-check session on bfcache restoration (Back/Forward navigation)
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      verifyActiveSession();
    }
  });

  // Re-check session when tab regains visibility
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      verifyActiveSession();
    }
  });

  // ── Dashboard Interactive Initialization ──
  document.addEventListener('DOMContentLoaded', function () {
    if (!verifyActiveSession()) return;

    // 1. Populate personalized user information
    const welcomeEl = document.getElementById('dashboard-welcome');
    const emailEl = document.getElementById('dashboard-user-email');

    let currentUser = null;
    if (window.Auth && typeof window.Auth.getCurrentUser === 'function') {
      currentUser = window.Auth.getCurrentUser();
    }

    const email = currentUser && currentUser.email ? currentUser.email : (sessionStorage.getItem('sessionUser') || 'admin@gmail.com');
    let displayName = currentUser && currentUser.name ? currentUser.name : (sessionStorage.getItem('sessionName') || '');

    if (!displayName) {
      const prefix = email.split('@')[0];
      displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }

    if (welcomeEl) {
      welcomeEl.textContent = 'Welcome, ' + displayName + '.';
    }
    if (emailEl) {
      emailEl.textContent = email;
    }

    // 2. Sign Out Handler
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.Auth && typeof window.Auth.clearSession === 'function') {
          window.Auth.clearSession();
        } else {
          sessionStorage.clear();
        }
        // Replace history entry so back button doesn't restore dashboard
        window.location.replace('index.html');
      });
    }

    // 3. Live Date and Time
    const dateEl = document.getElementById('dashboard-date');
    if (dateEl) {
      function refreshDateTime() {
        const now = new Date();
        const options = {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
      }
      refreshDateTime();
      setInterval(refreshDateTime, 30000);
    }

    // 4. Search and Status Filtering
    const searchInput = document.getElementById('user-search');
    const filterPills = document.querySelectorAll('.ledger-filter-pill');
    const tableBody = document.getElementById('users-table-body');
    const emptyRow = document.getElementById('empty-search-row');

    let activeFilter = 'all';

    function applyFilterAndSearch() {
      if (!tableBody) return;

      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const rows = tableBody.querySelectorAll('.ledger-row');
      let visibleCount = 0;

      rows.forEach(function (row) {
        const rowText = row.textContent.toLowerCase();
        const status = row.getAttribute('data-status') || '';

        const matchesSearch = !query || rowText.includes(query);
        const matchesFilter = activeFilter === 'all' || status === activeFilter;

        if (matchesSearch && matchesFilter) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (emptyRow) {
        emptyRow.style.display = visibleCount === 0 ? '' : 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilterAndSearch);
    }

    if (filterPills.length) {
      filterPills.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filterPills.forEach(function (p) { p.classList.remove('filter-active'); });
          this.classList.add('filter-active');
          activeFilter = this.getAttribute('data-filter') || 'all';
          applyFilterAndSearch();
        });
      });
    }

    // 5. Reveal dashboard content once initialization is complete
    const folioEl = document.getElementById('dashboard-content');
    if (folioEl) {
      folioEl.style.visibility = 'visible';
      folioEl.style.opacity = '1';
    }
  });
})();
