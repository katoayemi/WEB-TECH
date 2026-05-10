/**
 * reg.js — Student Registration Frontend
 * Handles form validation, API communication, and table rendering.
 */

'use strict';

/* ── Constants ─────────────────────────────────────── */
const API_BASE = '/api/students';

/* ── DOM Refs ──────────────────────────────────────── */
const nameInput      = document.getElementById('name');
const rollInput      = document.getElementById('roll');
const nameError      = document.getElementById('name-error');
const rollError      = document.getElementById('roll-error');
const submitBtn      = document.getElementById('submit-btn');
const formWrap       = document.getElementById('form-wrap');
const successWrap    = document.getElementById('success-wrap');
const successMsg     = document.getElementById('success-msg');
const registerAgain  = document.getElementById('register-another');
const apiErrorBanner = document.getElementById('api-error');
const refreshBtn     = document.getElementById('refresh-btn');
const tableWrap      = document.getElementById('table-wrap');

/* ── Client-side Validation Rules ─────────────────── */
const rules = {
  name: {
    pattern: /^[a-zA-Z\s'-]{2,100}$/,
    message: 'Name must be 2–100 letters, spaces, hyphens, or apostrophes.',
  },
  roll: {
    pattern: /^[a-zA-Z0-9]{1,20}$/,
    message: 'Roll number must be 1–20 alphanumeric characters.',
  },
};

function validateField(input, errorEl, rule) {
  const val = input.value.trim();
  if (!val) {
    setError(input, errorEl, `${input.labels[0].textContent} is required.`);
    return false;
  }
  if (!rule.pattern.test(val)) {
    setError(input, errorEl, rule.message);
    return false;
  }
  clearError(input, errorEl);
  return true;
}

function setError(input, errorEl, msg) {
  errorEl.textContent = msg;
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
}

function clearError(input, errorEl) {
  errorEl.textContent = '';
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
}

/* ── Real-time Inline Validation ───────────────────── */
nameInput.addEventListener('blur', () => validateField(nameInput, nameError, rules.name));
rollInput.addEventListener('blur', () => validateField(rollInput, rollError, rules.roll));

nameInput.addEventListener('input', () => {
  if (nameInput.classList.contains('is-invalid'))
    validateField(nameInput, nameError, rules.name);
});
rollInput.addEventListener('input', () => {
  if (rollInput.classList.contains('is-invalid'))
    validateField(rollInput, rollError, rules.roll);
});

/* ── Submit ────────────────────────────────────────── */
submitBtn.addEventListener('click', handleSubmit);
nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });
rollInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });

async function handleSubmit() {
  hideApiError();

  const nameOk = validateField(nameInput, nameError, rules.name);
  const rollOk = validateField(rollInput, rollError, rules.roll);
  if (!nameOk || !rollOk) return;

  setLoading(true);

  try {
    const res = await fetch(API_BASE, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        roll: rollInput.value.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Server-side validation or conflict error
      showApiError(data.message || 'Registration failed. Please try again.');
      return;
    }

    // ── Success ──
    successMsg.textContent =
      `${data.data.name} (Roll: ${data.data.rollNumber}) has been registered successfully.`;
    formWrap.hidden    = true;
    successWrap.hidden = false;

    // Refresh the table in the background
    loadStudents();

  } catch (err) {
    console.error('Network error:', err);
    showApiError('Could not reach the server. Check your connection and try again.');
  } finally {
    setLoading(false);
  }
}

/* ── Register Another ──────────────────────────────── */
registerAgain.addEventListener('click', () => {
  nameInput.value = '';
  rollInput.value = '';
  [nameInput, rollInput].forEach(el => {
    el.classList.remove('is-valid', 'is-invalid');
  });
  nameError.textContent = '';
  rollError.textContent = '';
  formWrap.hidden    = false;
  successWrap.hidden = true;
  hideApiError();
  nameInput.focus();
});

/* ── Loading State ─────────────────────────────────── */
function setLoading(state) {
  submitBtn.disabled = state;
  submitBtn.classList.toggle('loading', state);
}

/* ── API Error Banner ──────────────────────────────── */
function showApiError(msg) {
  apiErrorBanner.textContent = msg;
  apiErrorBanner.hidden = false;
}
function hideApiError() {
  apiErrorBanner.hidden = true;
  apiErrorBanner.textContent = '';
}

/* ── Students Table ────────────────────────────────── */
refreshBtn.addEventListener('click', loadStudents);

async function loadStudents() {
  tableWrap.innerHTML = '<p class="table-empty">Loading…</p>';
  try {
    const res  = await fetch(`${API_BASE}?limit=50`);
    const data = await res.json();

    if (!res.ok || !data.students?.length) {
      tableWrap.innerHTML = '<p class="table-empty">No students registered yet.</p>';
      return;
    }

    tableWrap.innerHTML = buildTable(data.students);
  } catch {
    tableWrap.innerHTML =
      '<p class="table-empty">Failed to load students. Try refreshing.</p>';
  }
}

function buildTable(students) {
  const rows = students.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escHtml(s.name)}</td>
      <td>${escHtml(s.roll_number)}</td>
      <td>${new Date(s.created_at).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      })}</td>
    </tr>`).join('');

  return `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Roll No.</th>
          <th>Registered</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/** Escape HTML to prevent XSS from database values */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── Init ──────────────────────────────────────────── */
loadStudents();
