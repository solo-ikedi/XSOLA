// ─────────────────────────────────────────────────────
//  XSola API Service
//  All backend calls live here.
//  When co-founder changes an endpoint, update it HERE only.
// ─────────────────────────────────────────────────────

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const HEADERS = { 'Content-Type': 'application/json' };

// Helper — throws clear error if response is not OK
async function request(url, options = {}) {
  try {
    const res = await fetch(url, { ...options, headers: HEADERS });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
    return data;
  } catch (err) {
    if (err.name === 'TypeError') {
      throw new Error('Cannot reach backend — is the server running?');
    }
    throw err;
  }
}

// ── AUTH ──────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    request(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (name, phone, email, password) =>
    request(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ name, phone, email, password }),
    }),

  logout: () =>
    request(`${BASE_URL}/auth/logout`, { method: 'POST' }),
};

// ── POWER ─────────────────────────────────────────────
export const powerAPI = {
  // GET /status?shop_id=1
  // Returns: { power_on, time_remaining, last_payment, device_status }
  getStatus: (shopId) =>
    request(`${BASE_URL}/status?shop_id=${shopId}`),

  // POST /toggle  { shop_id, action: "on"|"off" }
  toggle: (shopId, turnOn) =>
    request(`${BASE_URL}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ shop_id: shopId, action: turnOn ? 'on' : 'off' }),
    }),
};

// ── PAYMENT ───────────────────────────────────────────
export const paymentAPI = {
  // POST /pay  { shop_id, amount }
  // Returns: { success, message, time_added }
  pay: (shopId, amount) =>
    request(`${BASE_URL}/pay`, {
      method: 'POST',
      body: JSON.stringify({ shop_id: shopId, amount }),
    }),

  // GET /history?shop_id=1
  // Returns: [{ id, amount, date, time_added, status }]
  getHistory: (shopId) =>
    request(`${BASE_URL}/history?shop_id=${shopId}`),
};