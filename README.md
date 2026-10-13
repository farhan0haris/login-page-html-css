# Victorian Correspondence & Administrative Folio — Login, Registration & Dashboard

A responsive login, registration, and administrative dashboard web application built with HTML5, CSS3, and vanilla JavaScript. Features a distinctive Victorian-inspired visual identity with fine parchment textures, directional evening lamp illumination, subtle glassmorphism, restrained brass accents, and sharp typography.

## Features

- **Victorian Correspondence Design:** Atmospheric writing desk with warm parchment sheets, directional lamp glow, tactile wax seal, and fine letterpress borders.
- **Administrative Folio Dashboard:** Redesigned administrative ledger folio with refined header, distinct summary cards, and recent users directory.
- **Automatic Login After Registration:** Newly registered users are authenticated immediately upon valid registration and routed directly to the dashboard with personalized greetings.
- **Web Crypto API Password Hashing:** Client-side account persistence with SHA-256 cryptographic hashing (passwords are never stored in raw text).
- **Persistent Demo Accounts:** Registered accounts persist in `localStorage` and can sign in again in subsequent sessions without overwriting administrator credentials.
- **Administrator Access:** Hardcoded demo administrator account (`admin@gmail.com` / `Admin@123`) always remains active and accessible.
- **Duplicate Account Protection:** Rejects registration attempts using existing email addresses with accessible validation errors.
- **Protected Dashboard:** Strict session control via `sessionStorage` with bfcache and visibility-change protection against back-navigation leaks.
- **Summary Statistics:** Clean metrics grid displaying exact values:
  - **Total Users:** 120 (Registry theme)
  - **Active Users:** 95 (Emerald status badge: `● 79% Active`)
  - **Pending Requests:** 25 (Amber status badge: `○ Action Required`)
- **Recent Users Directory:** Structured ledger table featuring required users:
  - Rahul (`rahul@gmail.com`, Active)
  - Priya (`priya@gmail.com`, Active)
  - Arjun (`arjun@gmail.com`, Pending)
- **Realtime Search & Filter:** Interactive name/email search and status filtering (All, Active, Pending) with empty state messaging.
- **Fully Responsive:** Seamless layout from mobile viewports (320px, 360px, 375px, 390px, 414px) through tablet (768px) and desktop (1024px, 1280px+).

## Tech Stack

- **Structure:** HTML5 semantic markup
- **Styling:** Vanilla CSS3 (Custom properties, grid, flexbox, glassmorphism)
- **Logic:** Vanilla JavaScript (ES6+, Web Crypto API, Storage API)
- **Dependencies:** None (No frameworks, CSS libraries, or external authentication packages)

## Project Structure

```text
login-page-html-css/
├── index.html          # Sign In page (Victorian letter stationery)
├── register.html       # Create Account page (with auto-login flow)
├── dashboard.html      # Administrative Folio dashboard
├── style.css           # Design tokens, layout, typography, and responsive styles
├── js/
│   ├── auth.js         # Shared authentication, Web Crypto hashing & session manager
│   ├── login.js        # Sign-in form controller
│   ├── register.js     # Registration validation & auto-login controller
│   └── dashboard.js    # Dashboard session gate, search, filters & logout
├── assets/
│   └── favicon.svg     # Wax seal crest favicon
└── README.md           # Documentation
```

## Running Locally

Open `index.html` directly in any modern browser:

```
File → Open → index.html
```

Or run using a lightweight local web server:

```bash
npx serve .
```

## Demo Credentials

| Role | Email | Password |
|:-----|:------|:---------|
| Administrator | `admin@gmail.com` | `Admin@123` |
| Registered Users | Custom email | Custom password (persisted in `localStorage`) |

## How Authentication & Registration Work

1. **Sign In (`index.html`):** Validates required inputs, queries `window.Auth` for matching admin or hashed `localStorage` accounts, initializes `sessionStorage`, and redirects to `dashboard.html`.
2. **Registration (`register.html`):** Validates name, email format, minimum password length, password confirmation match, and email uniqueness. On success, hashes the password with SHA-256 via Web Crypto API, saves the record to `localStorage`, initializes active session, and redirects directly to `dashboard.html` without revisiting the login page.
3. **Session Protection (`dashboard.html`):** An inline script executes before any page rendering to verify active `sessionStorage`. If missing or logged out, the browser replaces history directly with `index.html`.
4. **Logout:** Clears all session keys and calls `window.location.replace('index.html')` to ensure forward/back navigation cannot access protected pages.

## Security Notice

> **This project is a client-side frontend demonstration.**
> In a production environment:
> - Authentication, password hashing (e.g. Argon2, bcrypt), and credential validation must take place on a secure backend server.
> - Sessions must utilize secure, HTTP-only, SameSite cookies or signed tokens.
> - Client-side storage (`localStorage` / `sessionStorage`) is inherently accessible to client scripts and must not be used for production credentials.

## License

MIT
