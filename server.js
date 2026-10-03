import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Public classroom credentials, not a real user account.
const demoEmail = 'student@example.com';
const salt = randomBytes(16);
const storedHash = scryptSync('JuiceShopDemo123!', salt, 64);
const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/favicon.svg', ['favicon.svg', 'image/svg+xml']]
]);

export function validateLogin(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') return 'Email and password must be strings.';
  if (!email.trim() || !password.trim()) return 'Email and password are required.';
  if (email.length > 254 || password.length > 128) return 'Input exceeds the allowed length.';
  if (!email.includes('@')) return 'Email must contain @.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

export function createAppServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    try {
      const pathname = new URL(req.url, 'http://localhost').pathname;
      if (req.method === 'GET' && assets.has(pathname)) {
        const [file, type] = assets.get(pathname);
        const content = await readFile(new URL(`./public/${file}`, import.meta.url));
        res.writeHead(200, { 'Content-Type': type });
        return res.end(content);
      }
      if (pathname !== '/api/login') return json(res, 404, { message: 'Not found.' });
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return json(res, 405, { message: 'Use POST for login.' });
      }
      if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') return json(res, 415, { message: 'Send JSON input.' });
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 4096) return json(res, 413, { message: 'Request is too large.' });
        chunks.push(chunk);
      }
      let data;
      try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch { return json(res, 400, { message: 'Invalid JSON.' }); }
      if (!data || typeof data !== 'object' || Array.isArray(data)) return json(res, 400, { message: 'Send an object with email and password.' });
      const error = validateLogin(data.email, data.password);
      if (error) return json(res, 400, { message: error });
      // Input is never evaluated or used to construct a SQL statement.
      const candidateHash = scryptSync(data.password, salt, 64);
      const matches = timingSafeEqual(candidateHash, storedHash);
      if (data.email.trim() !== demoEmail || !matches) return json(res, 401, { message: 'Invalid email or password.' });
      return json(res, 200, { message: 'Demo login successful. Server validation passed.' });
    } catch {
      if (!res.headersSent) json(res, 500, { message: 'Unable to process the request.' });
      else res.end();
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3001);
  createAppServer().listen(port, '127.0.0.1', () => console.log(`Login form: http://localhost:${port}`));
}
