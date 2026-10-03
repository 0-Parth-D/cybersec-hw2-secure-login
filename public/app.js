const form = document.querySelector('#login-form');
const message = document.querySelector('#message');
const button = document.querySelector('#login-button');
const infoButton = document.querySelector('#info-button');
const demoInfo = document.querySelector('#demo-info');
const passwordInput = document.querySelector('#password');
const passwordToggle = document.querySelector('#password-toggle');
const successDialog = document.querySelector('#success-dialog');
const successEmail = document.querySelector('#success-email');
const successClose = document.querySelector('#success-close');

// Immediate browser feedback; the server independently repeats these rules.
function validateLogin(email, password) {
  if (!email.trim() || !password.trim()) return 'Email and password are required.';
  if (email.length > 254 || password.length > 128) return 'Input exceeds the allowed length.';
  if (!email.includes('@')) return 'Email must contain @.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function showMessage(text, success = false) {
  message.textContent = text; // Never interpret messages as HTML.
  message.className = success ? 'success' : 'error';
}

function setDemoInfo(open) {
  infoButton.setAttribute('aria-expanded', String(open));
  demoInfo.hidden = !open;
}

function closeSuccessDialog() {
  successDialog.close();
  button.focus();
}

function setPasswordVisible(visible) {
  passwordInput.type = visible ? 'text' : 'password';
  passwordToggle.setAttribute('aria-pressed', String(visible));
}

infoButton.addEventListener('click', () => setDemoInfo(demoInfo.hidden));

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (successDialog.open) {
    event.preventDefault();
    closeSuccessDialog();
  } else if (!demoInfo.hidden) {
    setDemoInfo(false);
    infoButton.focus();
  }
});

passwordToggle.addEventListener('click', () => {
  setPasswordVisible(passwordInput.type === 'password');
});

successClose.addEventListener('click', closeSuccessDialog);
successDialog.addEventListener('click', (event) => {
  if (event.target === successDialog) closeSuccessDialog();
});
successDialog.addEventListener('close', () => button.focus());

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = form.elements.email.value;
  const password = form.elements.password.value;
  const error = validateLogin(email, password);
  if (error) return showMessage(error);
  setPasswordVisible(false);
  button.disabled = true;
  showMessage('Checking your credentials…');
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (response.ok) {
      form.elements.password.value = '';
      message.textContent = '';
      successEmail.textContent = email.trim();
      successDialog.showModal();
    } else {
      showMessage(result.message);
    }
  } catch {
    showMessage('Cannot reach the server. Start the app with npm start and try again.');
  } finally { button.disabled = false; }
});
