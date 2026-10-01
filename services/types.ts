/** Shared API / domain types — ready for backend integration */

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  businessName?: string;
  createdAt?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  category?: string;
  lowStockThreshold?: number;
};

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export type InvoiceLine = {
  name: string;
  qty: number;
  price: number;
};

export type Invoice = {
  id: string;
  customerId: string;
  customerName: string;
  items: InvoiceLine[];
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  notes?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

export type SignUpPayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type BusinessSnapshot = {
  customers: Customer[];
  inventory: InventoryItem[];
  invoices: Invoice[];
};
