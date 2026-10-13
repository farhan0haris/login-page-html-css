# Login and Dashboard

A responsive login and registration application with a distinctive Victorian-inspired visual design, parchment textures, refined typography and a matching administrative dashboard.

## Features

- **Login with demo administrator credentials** for immediate administrative access
- **Input validation and error messages** providing accessible, real-time feedback
- **User registration with automatic login** navigating directly to the dashboard upon successful registration
- **Persisted demo accounts** in browser `localStorage` with Web Crypto API (SHA-256) password hashing
- **Session management using `sessionStorage`** ensuring active session handling
- **Protected dashboard with logout** guarding against unauthenticated access and bfcache history traversal
- **Dashboard summary cards** displaying Total Users (120), Active Users (95), and Pending Requests (25)
- **Recent users table** displaying directory records for Rahul, Priya, and Arjun with distinct status indicators
- **User search and status filtering** with live query matching and status filtering (All, Active, Pending)
- **Responsive layouts** engineered for viewports across desktop, tablet, and mobile (320px–1200px+)
- **Victorian-inspired visual styling** with rich walnut tones, warm ivory surfaces, and restrained CSS animations

## Demo Credentials

- **Email:** `admin@gmail.com`
- **Password:** `Admin@123`

> **Demonstration Notice:** These are demonstration credentials. All authentication, validation, and session handling are implemented on the client side for demonstration purposes. This is not production-secure authentication.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

## Project Structure

```text
login-page-html-css/
├── index.html          # Login page (Victorian correspondence letter theme)
├── register.html       # Registration page with direct auto-login flow
├── dashboard.html      # Protected administrative ledger dashboard
├── style.css           # Core stylesheet (design tokens, layouts, responsive styles)
├── js/
│   ├── auth.js         # Shared authentication module, Web Crypto hashing & session manager
│   ├── login.js        # Sign-in form validation & controller
│   ├── register.js     # Registration form validation & auto-login controller
│   └── dashboard.js    # Dashboard session gate, search, filters & logout controller
├── assets/
│   └── favicon.svg     # Monogram seal crest favicon
└── README.md           # Project documentation
```

## How to Run

### Direct File Access
Open `index.html` directly in any modern browser:
```
File → Open → index.html
```

### Using a Local Static Server
Alternatively, serve the repository using a local static web server:

Using `npx serve`:
```bash
npx serve .
```

Or using Python:
```bash
python -m http.server 3000
```

Then navigate to `http://localhost:3000` in your web browser.

## Authentication Limitations

Browser storage (`localStorage` and `sessionStorage`) and client-side credential checks are used solely for this demonstration. Passwords are saved as SHA-256 hashes via the Web Crypto API, but client-side storage remains accessible to browser scripts.

In a production application:
- User authentication and authorization must always be enforced on a secure backend server.
- Passwords must be salted and hashed on the server using industry standards such as Argon2 or bcrypt.
- Sessions must be managed with secure, HTTP-only, SameSite cookies or signed tokens.
- Sensitive credentials must never be validated or stored in client-side code.

## License

MIT
