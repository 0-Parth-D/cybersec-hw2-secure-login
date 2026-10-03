# HW 2-B: Juice Shop-Inspired Login Form

HTML, CSS, and JavaScript login page with a Node.js server that independently validates requests. This is a classroom demo, not an official Juice Shop application.

## Run

Install Node.js 22 or later. No external packages or npm install are required.

```sh
npm start
```

Open http://localhost:3001. Keep the terminal running; press Control+C to stop. Do not open index.html directly: server validation requires the running server. Port 3001 avoids conflicting with Juice Shop on port 3000. For another port, use `PORT=3002 npm start`.

## Demo account

Use this account to test a successful login:

- Email: `student@example.com`
- Password: `JuiceShopDemo123!`

These public credentials are only for this lab.

## Requirements implemented

- Email and masked password fields, with a show/hide password button. The password is masked again before submission.
- An info button next to the heading reveals the demo credentials, and a success dialog confirms a valid login.
- Accessibility (WCAG 2.2 AA): labelled controls, visible focus outlines, keyboard support including Escape to close, focus returned after the dialog closes, at least 3:1 contrast for icons, and reduced motion when the user's system requests it.
- JavaScript `validateLogin(email, password)` prevents empty or whitespace-only submissions, checks that email contains `@`, and requires at least eight password characters.
- The server repeats every check, checks field types, and limits input and request size. Direct requests cannot bypass server validation.
- HTTP 400 for validation errors; HTTP 401 for incorrect credentials; HTTP 200 for the demo account.
- Salted scrypt password hashing and constant-time hash comparison. Passwords are not logged or stored in browser storage.
- Status messages use `textContent`, not `innerHTML`. Input is never evaluated or used to build SQL. A Content Security Policy restricts script loading.

The email check is the assignment's basic rule, not complete email-address verification. Successful login displays a confirmation; no sessions, registration, or protected pages are implemented. A production app would also need HTTPS, persistent user storage, rate limiting, secure sessions, and authorization.

## Files

- `public/index.html`: form markup.
- `public/app.js`: browser validation and submission.
- `public/styles.css`: responsive appearance inspired by Juice Shop.
- `public/favicon.svg`: logo used in the header and as the browser-tab icon.
- `server.js`: server validation and demo login.

## Manual checks

Browser checks: submit blank fields, email without `@`, a seven-character password, wrong credentials, and correct demo credentials. The browser should block the first three, the server should reject incorrect credentials, and the demo account should succeed.

## Part 3 attack attempts

With the app running, enter `<img src=x onerror=alert('XSS')>@example.com` as email and an eight-or-more-character password. Expect a generic invalid-credentials response and no JavaScript alert. Try `student@example.com' OR 1=1--` with a wrong password; expect rejection. Inspect requests and responses in browser developer tools and take your own screenshots. These are expected outcomes, not a claim that you personally executed the tests.

## Public GitHub submission

Create a public GitHub repository and upload this project's files. Include the actual repository URL in the assignment PDF and verify that it is visible while signed out. A local folder or localhost URL does not meet the public-repository requirement.
