// Direct Base44 API client — no SDK dependency needed
const APP_ID = '69b90fd2e29285ce5a154ddc';
const BASE_URL = 'https://base44.app/api';
const STORAGE_KEY = 'base44_access_token';

function getToken() {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function setToken(token) {
  try {
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem('token', token);
  } catch {}
}

function removeToken() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('token');
  } catch {}
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'X-App-Id': APP_ID,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.message || 'Request failed'), { status: res.status, response: { data: err } });
  }
  return res.json();
}

export const auth = {
  async me() {
    return apiFetch(`/apps/${APP_ID}/entities/User/me`);
  },
  async loginViaEmailPassword(email, password) {
    const data = await apiFetch(`/apps/${APP_ID}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) setToken(data.access_token);
    return data;
  },
  async register({ email, password, full_name }) {
    const data = await apiFetch(`/apps/${APP_ID}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    });
    if (data.access_token) setToken(data.access_token);
    return data;
  },
  loginWithProvider(provider, fromUrl) {
    const redirectUrl = fromUrl || window.location.href;
    const url = `https://base44.app/api/apps/auth/login?app_id=${APP_ID}&from_url=${encodeURIComponent(redirectUrl)}`;
    window.location.href = url;
  },
  logout(redirectUrl) {
    removeToken();
    const fromUrl = redirectUrl || window.location.href;
    window.location.href = `https://base44.app/api/apps/auth/logout?from_url=${encodeURIComponent(fromUrl)}`;
  },
  setToken,
  getToken,
};

// Entity helpers
function makeEntity(name) {
  return {
    async list() { return apiFetch(`/apps/${APP_ID}/entities/${name}`); },
    async get(id) { return apiFetch(`/apps/${APP_ID}/entities/${name}/${id}`); },
    async create(data) { return apiFetch(`/apps/${APP_ID}/entities/${name}`, { method: 'POST', body: JSON.stringify(data) }); },
    async update(id, data) { return apiFetch(`/apps/${APP_ID}/entities/${name}/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(id) { return apiFetch(`/apps/${APP_ID}/entities/${name}/${id}`, { method: 'DELETE' }); },
    async filter(params) {
      const qs = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
      return apiFetch(`/apps/${APP_ID}/entities/${name}?${qs}`);
    },
  };
}

export const Item = makeEntity('Item');
export const ExchangeRequest = makeEntity('ExchangeRequest');
export const Transaction = makeEntity('Transaction');
export const Order = makeEntity('Order');
export const Notification = makeEntity('Notification');
export const Wishlist = makeEntity('Wishlist');
export const Review = makeEntity('Review');
export const Category = makeEntity('Category');
export const UserAchievement = makeEntity('UserAchievement');
export const Referral = makeEntity('Referral');
export const ActivityFeed = makeEntity('ActivityFeed');
export const WeeklyChallenge = makeEntity('WeeklyChallenge');
export const UserChallengeProgress = makeEntity('UserChallengeProgress');
export const OrderMessage = makeEntity('OrderMessage');
export const Dispute = makeEntity('Dispute');

export { getToken as getAccessToken, setToken as saveAccessToken, removeToken as removeAccessToken };
