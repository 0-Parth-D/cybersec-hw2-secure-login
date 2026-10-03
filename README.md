# Juice Shop Login Form

A simple login page inspired by OWASP Juice Shop, built with HTML, CSS, and JavaScript, with a small Node.js server.

## What it does

- Email and password input fields.
- Client-side validation (`public/app.js`): blocks empty submissions, checks the email contains `@`, and requires a password of at least 8 characters.
- Server-side validation (`server.js`): repeats the same checks, so they can't be bypassed by skipping the browser.
- Passwords are hashed with salted scrypt.

## How to run

Requires Node.js 22 or later. No `npm install` needed.

```sh
npm start
```

Then open http://localhost:3001.

## Demo account

- Email: `student@example.com`
- Password: `JuiceShopDemo123!`
