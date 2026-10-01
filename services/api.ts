/**
 * API client layer.
 *
 * - Local adapter: AsyncStorage (default, offline-first)
 * - Remote adapter: fetch against AppConfig.API_BASE_URL
 *
 * Switch with AppConfig.USE_REMOTE_API — UI/contexts stay the same.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '@/constants/config';
import type {
  ApiResult,
  AuthTokens,
  BusinessSnapshot,
  Customer,
  InventoryItem,
  Invoice,
  SignInPayload,
  SignUpPayload,
  User,
} from './types';

// ─── HTTP helpers (remote) ───────────────────────────────────────────────────

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(AppConfig.storage.token);
}

async function setToken(token: string | null) {
  if (token) await AsyncStorage.setItem(AppConfig.storage.token, token);
  else await AsyncStorage.removeItem(AppConfig.storage.token);
}

async function remoteFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  const token = await getToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AppConfig.API_TIMEOUT_MS);

  try {
    const res = await fetch(`${AppConfig.API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string>),
      },
    });
    clearTimeout(timer);

    let body: any = null;
    const text = await res.text();
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = { message: text };
      }
    }

    if (!res.ok) {
      return {
        ok: false,
        error: body?.message || body?.error || `Request failed (${res.status})`,
        status: res.status,
      };
    }
    return { ok: true, data: body as T };
  } catch (e: any) {
    clearTimeout(timer);
    const msg =
      e?.name === 'AbortError'
        ? 'Request timed out. Check your connection.'
        : e?.message || 'Network error';
    return { ok: false, error: msg };
  }
}

// ─── Local auth storage ──────────────────────────────────────────────────────

type LocalUserRecord = { password: string; user: User };

async function localGetUsers(): Promise<Record<string, LocalUserRecord>> {
  try {
    const raw = await AsyncStorage.getItem(AppConfig.storage.users);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function localSaveUsers(users: Record<string, LocalUserRecord>) {
  await AsyncStorage.setItem(AppConfig.storage.users, JSON.stringify(users));
}

// ─── Auth API ────────────────────────────────────────────────────────────────

export const authApi = {
  async signUp(payload: SignUpPayload): Promise<ApiResult<{ user: User; tokens?: AuthTokens }>> {
    if (AppConfig.USE_REMOTE_API) {
      const res = await remoteFetch<{ user: User; accessToken: string; refreshToken?: string }>(
        '/auth/register',
        { method: 'POST', body: JSON.stringify(payload) }
      );
      if (!res.ok) return res;
      await setToken(res.data.accessToken);
      await AsyncStorage.setItem(AppConfig.storage.session, JSON.stringify(res.data.user));
      return {
        ok: true,
        data: {
          user: res.data.user,
          tokens: { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken },
        },
      };
    }

    // Local
    const name = payload.name.trim();
    const email = payload.email.trim().toLowerCase();
    const password = payload.password;
    if (!name || !email || !password) {
      return { ok: false, error: 'Please fill in name, email and password.' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }
    const users = await localGetUsers();
    if (users[email]) {
      return { ok: false, error: 'An account with this email already exists. Please sign in.' };
    }
    const user: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      phone: payload.phone?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    users[email] = { password, user };
    await localSaveUsers(users);
    await AsyncStorage.setItem(AppConfig.storage.session, JSON.stringify(user));
    return { ok: true, data: { user } };
  },

  async signIn(payload: SignInPayload): Promise<ApiResult<{ user: User; tokens?: AuthTokens }>> {
    if (AppConfig.USE_REMOTE_API) {
      const res = await remoteFetch<{ user: User; accessToken: string; refreshToken?: string }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify(payload) }
      );
      if (!res.ok) return res;
      await setToken(res.data.accessToken);
      await AsyncStorage.setItem(AppConfig.storage.session, JSON.stringify(res.data.user));
      return {
        ok: true,
        data: {
          user: res.data.user,
          tokens: { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken },
        },
      };
    }

    const email = payload.email.trim().toLowerCase();
    if (!email || !payload.password) {
      return { ok: false, error: 'Please enter email and password.' };
    }
    const users = await localGetUsers();
    const entry = users[email];
    if (!entry) {
      return { ok: false, error: 'No account found with this email. Please sign up.' };
    }
    if (entry.password !== payload.password) {
      return { ok: false, error: 'Incorrect password. Try again.' };
    }
    await AsyncStorage.setItem(AppConfig.storage.session, JSON.stringify(entry.user));
    return { ok: true, data: { user: entry.user } };
  },

  async signOut(): Promise<void> {
    if (AppConfig.USE_REMOTE_API) {
      await remoteFetch('/auth/logout', { method: 'POST' }).catch(() => {});
      await setToken(null);
    }
    await AsyncStorage.removeItem(AppConfig.storage.session);
  },

  async getSession(): Promise<User | null> {
    try {
      const raw = await AsyncStorage.getItem(AppConfig.storage.session);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async updateProfile(patch: Partial<User>): Promise<ApiResult<User>> {
    if (AppConfig.USE_REMOTE_API) {
      const res = await remoteFetch<User>('/me', {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        await AsyncStorage.setItem(AppConfig.storage.session, JSON.stringify(res.data));
      }
      return res;
    }

    const session = await authApi.getSession();
    if (!session) return { ok: false, error: 'Not signed in' };
    const users = await localGetUsers();
    const email = session.email.toLowerCase();
    const entry = users[email];
    if (!entry) return { ok: false, error: 'User not found' };
    const updated: User = { ...entry.user, ...patch, id: entry.user.id, email: entry.user.email };
    users[email] = { ...entry, user: updated };
    await localSaveUsers(users);
    await AsyncStorage.setItem(AppConfig.storage.session, JSON.stringify(updated));
    return { ok: true, data: updated };
  },
};

// ─── Business data API ───────────────────────────────────────────────────────

const seedCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Amina Okoro',
    email: 'amina@example.com',
    phone: '+234 801 000 1111',
    company: 'Okoro Designs',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c2',
    name: 'James Chen',
    email: 'james@studio.io',
    phone: '+1 415 555 0199',
    company: 'Studio North',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c3',
    name: 'Sara Müller',
    email: 'sara@mueller.de',
    company: 'Müller & Co',
    createdAt: new Date().toISOString(),
  },
];

const seedInventory: InventoryItem[] = [
  {
    id: 'i1',
    name: 'Premium Notebook',
    sku: 'NB-001',
    quantity: 48,
    unitPrice: 12.5,
    category: 'Stationery',
    lowStockThreshold: 10,
  },
  {
    id: 'i2',
    name: 'Wireless Mouse',
    sku: 'WM-220',
    quantity: 15,
    unitPrice: 29.99,
    category: 'Electronics',
    lowStockThreshold: 5,
  },
  {
    id: 'i3',
    name: 'Desk Organizer',
    sku: 'DO-08',
    quantity: 3,
    unitPrice: 18.0,
    category: 'Office',
    lowStockThreshold: 5,
  },
  {
    id: 'i4',
    name: 'Focus Timer',
    sku: 'FT-01',
    quantity: 22,
    unitPrice: 24.0,
    category: 'Productivity',
    lowStockThreshold: 8,
  },
];

const seedInvoices: Invoice[] = [
  {
    id: 'inv1',
    customerId: 'c1',
    customerName: 'Amina Okoro',
    items: [{ name: 'Premium Notebook', qty: 10, price: 12.5 }],
    total: 125,
    status: 'paid',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv2',
    customerId: 'c2',
    customerName: 'James Chen',
    items: [
      { name: 'Wireless Mouse', qty: 2, price: 29.99 },
      { name: 'Desk Organizer', qty: 1, price: 18.0 },
    ],
    total: 77.98,
    status: 'sent',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

function dataKey(userId: string) {
  return `${AppConfig.storage.dataPrefix}${userId}`;
}

export const dataApi = {
  async loadSnapshot(userId: string): Promise<BusinessSnapshot> {
    if (AppConfig.USE_REMOTE_API) {
      const res = await remoteFetch<BusinessSnapshot>('/business/snapshot');
      if (res.ok) return res.data;
      return { customers: [], inventory: [], invoices: [] };
    }
    try {
      const raw = await AsyncStorage.getItem(dataKey(userId));
      if (raw) {
        const data = JSON.parse(raw);
        return {
          customers: data.customers ?? seedCustomers,
          inventory: data.inventory ?? seedInventory,
          invoices: data.invoices ?? seedInvoices,
        };
      }
    } catch {
      /* fall through */
    }
    return {
      customers: seedCustomers,
      inventory: seedInventory,
      invoices: seedInvoices,
    };
  },

  async saveSnapshot(userId: string, snapshot: BusinessSnapshot): Promise<void> {
    if (AppConfig.USE_REMOTE_API) {
      await remoteFetch('/business/snapshot', {
        method: 'PUT',
        body: JSON.stringify(snapshot),
      });
      return;
    }
    await AsyncStorage.setItem(dataKey(userId), JSON.stringify(snapshot));
  },
};

export { setToken, getToken };
