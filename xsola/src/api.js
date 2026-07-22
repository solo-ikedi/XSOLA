// ─────────────────────────────────────────────────────
//  XSola API Service
//  All backend calls live here.
//  When co-founder changes an endpoint, update it HERE only.
// ─────────────────────────────────────────────────────

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://xsola-backend-7.onrender.com';

// Helper — attaches auth token if available, throws clear error if response not OK
async function request(url, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.message || `Error ${res.status}`);
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
  // POST /api/v1/auth/auth/register
  register: (name, email, password) =>
    request(`${BASE_URL}/api/v1/auth/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  // POST /api/v1/auth/auth/login
  login: (email, password) =>
    request(`${BASE_URL}/api/v1/auth/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // GET /api/v1/auth/auth/me  (requires token)
  me: () =>
    request(`${BASE_URL}/api/v1/auth/auth/me`),
};

// ── USERS ─────────────────────────────────────────────
export const usersAPI = {
  // GET /api/v1/users/
  getAll: () =>
    request(`${BASE_URL}/api/v1/users/`),

  // GET /api/v1/users/{user_id}
  getById: (userId) =>
    request(`${BASE_URL}/api/v1/users/${userId}`),
};

// ── DEVICES ───────────────────────────────────────────
export const devicesAPI = {
  // GET /api/v1/devices/devices/
  getAll: () =>
    request(`${BASE_URL}/api/v1/devices/devices/`),

  // POST /api/v1/devices/devices/
  create: (deviceData) =>
    request(`${BASE_URL}/api/v1/devices/devices/`, {
      method: 'POST',
      body: JSON.stringify(deviceData),
    }),

  // GET /api/v1/devices/devices/{device_id}
  getById: (deviceId) =>
    request(`${BASE_URL}/api/v1/devices/devices/${deviceId}`),

  // DELETE /api/v1/devices/devices/{device_id}
  delete: (deviceId) =>
    request(`${BASE_URL}/api/v1/devices/devices/${deviceId}`, {
      method: 'DELETE',
    }),

  // POST /api/v1/devices/devices/{device_id}/activate
  activate: (deviceId) =>
    request(`${BASE_URL}/api/v1/devices/devices/${deviceId}/activate`, {
      method: 'POST',
    }),

  // POST /api/v1/devices/devices/{device_id}/deactivate
  deactivate: (deviceId) =>
    request(`${BASE_URL}/api/v1/devices/devices/${deviceId}/deactivate`, {
      method: 'POST',
    }),
};

// ── PAYMENTS ──────────────────────────────────────────
export const paymentAPI = {
  // GET /api/v1/payments/payments/
  getAll: () =>
    request(`${BASE_URL}/api/v1/payments/payments/`),

  // POST /api/v1/payments/payments/
  create: (paymentData) =>
    request(`${BASE_URL}/api/v1/payments/payments/`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  // GET /api/v1/payments/payments/{payment_id}
  getById: (paymentId) =>
    request(`${BASE_URL}/api/v1/payments/payments/${paymentId}`),

  // DELETE /api/v1/payments/payments/{payment_id}
  delete: (paymentId) =>
    request(`${BASE_URL}/api/v1/payments/payments/${paymentId}`, {
      method: 'DELETE',
    }),

  // POST /api/v1/payments/payments/initialize  (Paystack)
  initialize: (data) =>
    request(`${BASE_URL}/api/v1/payments/payments/initialize`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // GET /api/v1/payments/payments/verify/{reference}
  verify: (reference) =>
    request(`${BASE_URL}/api/v1/payments/payments/verify/${reference}`),
};

// ── CUSTOMERS ─────────────────────────────────────────
export const customersAPI = {
  // GET /api/v1/customers/customers/
  getAll: () =>
    request(`${BASE_URL}/api/v1/customers/customers/`),

  // POST /api/v1/customers/customers/
  create: (customerData) =>
    request(`${BASE_URL}/api/v1/customers/customers/`, {
      method: 'POST',
      body: JSON.stringify(customerData),
    }),

  // GET /api/v1/customers/customers/{customer_id}
  getById: (customerId) =>
    request(`${BASE_URL}/api/v1/customers/customers/${customerId}`),

  // DELETE /api/v1/customers/customers/{customer_id}
  delete: (customerId) =>
    request(`${BASE_URL}/api/v1/customers/customers/${customerId}`, {
      method: 'DELETE',
    }),
};

// ── SUBSCRIPTIONS ─────────────────────────────────────
export const subscriptionsAPI = {
  // GET /api/v1/subscriptions/
  getAll: () =>
    request(`${BASE_URL}/api/v1/subscriptions/`),

  // POST /api/v1/subscriptions/
  create: (subData) =>
    request(`${BASE_URL}/api/v1/subscriptions/`, {
      method: 'POST',
      body: JSON.stringify(subData),
    }),

  // GET /api/v1/subscriptions/{subscription_id}
  getById: (subId) =>
    request(`${BASE_URL}/api/v1/subscriptions/${subId}`),

  // GET /api/v1/subscriptions/customer/{customer_id}
  getByCustomer: (customerId) =>
    request(`${BASE_URL}/api/v1/subscriptions/customer/${customerId}`),
};

// ── TELEMETRY ─────────────────────────────────────────
export const telemetryAPI = {
  // GET /api/v1/telemetry/telemetry/
  getAll: () =>
    request(`${BASE_URL}/api/v1/telemetry/telemetry/`),

  // POST /api/v1/telemetry/telemetry/
  create: (data) =>
    request(`${BASE_URL}/api/v1/telemetry/telemetry/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // GET /api/v1/telemetry/telemetry/{telemetry_id}
  getById: (telemetryId) =>
    request(`${BASE_URL}/api/v1/telemetry/telemetry/${telemetryId}`),

  // DELETE /api/v1/telemetry/telemetry/{telemetry_id}
  delete: (telemetryId) =>
    request(`${BASE_URL}/api/v1/telemetry/telemetry/${telemetryId}`, {
      method: 'DELETE',
    }),

  // GET /api/v1/telemetry/telemetry/device/{device_id}
  getByDevice: (deviceId) =>
    request(`${BASE_URL}/api/v1/telemetry/telemetry/device/${deviceId}`),

  // GET /api/v1/telemetry/telemetry/device/{device_id}/latest
  getLatestByDevice: (deviceId) =>
    request(`${BASE_URL}/api/v1/telemetry/telemetry/device/${deviceId}/latest`),
};

// ── NOTIFICATIONS ─────────────────────────────────────
export const notificationsAPI = {
  // GET /api/v1/notifications/notifications/
  getAll: () =>
    request(`${BASE_URL}/api/v1/notifications/notifications/`),

  // POST /api/v1/notifications/notifications/
  create: (data) =>
    request(`${BASE_URL}/api/v1/notifications/notifications/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // GET /api/v1/notifications/notifications/{notification_id}
  getById: (notificationId) =>
    request(`${BASE_URL}/api/v1/notifications/notifications/${notificationId}`),

  // DELETE /api/v1/notifications/notifications/{notification_id}
  delete: (notificationId) =>
    request(`${BASE_URL}/api/v1/notifications/notifications/${notificationId}`, {
      method: 'DELETE',
    }),

  // PUT /api/v1/notifications/notifications/{notification_id}/read
  markAsRead: (notificationId) =>
    request(`${BASE_URL}/api/v1/notifications/notifications/${notificationId}/read`, {
      method: 'PUT',
    }),
};

// ── REPORTS ───────────────────────────────────────────
export const reportsAPI = {
  // GET /api/v1/reports/reports/dashboard
  getDashboard: () =>
    request(`${BASE_URL}/api/v1/reports/reports/dashboard`),
};

// ── WAITLIST ──────────────────────────────────────────
export const waitlistAPI = {
  // GET /api/v1/waitlist/
  getAll: () =>
    request(`${BASE_URL}/api/v1/waitlist/`),

  // POST /api/v1/waitlist/
  create: (data) =>
    request(`${BASE_URL}/api/v1/waitlist/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // GET /api/v1/waitlist/{waitlist_id}
  getById: (waitlistId) =>
    request(`${BASE_URL}/api/v1/waitlist/${waitlistId}`),
};

// ── HEALTH ────────────────────────────────────────────
export const healthAPI = {
  check: () => request(`${BASE_URL}/health`),
};