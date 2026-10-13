# Login & Dashboard

A responsive login, registration, and dashboard web application built with HTML5, CSS3, and vanilla JavaScript. Features a distinctive Victorian-inspired visual style with parchment textures, atmospheric lighting, subtle glassmorphism, and polished typography.

## Features

- **Login page** with email and password authentication
- **Registration page** for new account creation
- **Protected dashboard** with session-based access control
- **Logout** with full session cleanup
- **Demo authentication** with client-side credential validation
- **Session management** using `sessionStorage`
- **Form validation** with accessible inline error messages
- **Summary cards** displaying user statistics
- **Users table** with search and status filtering
- **Responsive design** for desktop, tablet, and mobile
- **Victorian-inspired UI** with parchment, warm lighting, and glassmorphism
- **Accessible** semantic HTML with ARIA attributes
- **Back/Forward protection** — dashboard cannot be accessed after logout via browser navigation
- **Current date/time** display on the dashboard

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks or libraries)

## Project Structure

```text
login-page-html-css/
├── index.html          # Login page
├── register.html       # Registration page
├── dashboard.html      # Protected dashboard
├── style.css           # Shared stylesheet
├── js/
│   ├── login.js        # Authentication logic
│   └── dashboard.js    # Session protection & dashboard features
├── assets/
│   └── favicon.svg
└── README.md
```

## Running Locally

Open `index.html` directly in a browser:

```
File → Open → index.html
```

Or use a simple local server:

```bash
npx serve .
```

## Demo Credentials

| Field    | Value          |
|:---------|:---------------|
| Email    | `admin@gmail.com` |
| Password | `Admin@123`    |

## How Authentication Works

1. The user enters email and password on the login page.
2. JavaScript validates both fields and checks them against the demo credentials.
3. On successful login, `sessionStorage` stores `isLoggedIn: true` and the user email.
4. The browser redirects to `dashboard.html`.
5. The dashboard checks `sessionStorage` immediately — if the session is missing, it redirects back to `index.html`.
6. On logout, `sessionStorage` is cleared and the user is redirected using `location.replace()`, which also prevents the browser Back button from returning to the dashboard.

## Security Notice

> **This is a client-side demo.** Credentials are validated entirely in the browser using JavaScript. This approach is suitable for prototypes and demonstrations only.
>
> In a real application:
> - Authentication and authorization must be enforced by a **backend server**.
> - Passwords must be **hashed and stored securely** on the server.
> - Session tokens should be **HTTP-only cookies** managed by the server.
> - Never store passwords or sensitive credentials in `localStorage`, `sessionStorage`, or client-side JavaScript.

## License

MIT
