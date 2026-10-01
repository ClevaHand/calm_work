import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { dataApi } from '@/services/api';
import type { Customer, InventoryItem, Invoice } from '@/services/types';

type AppDataContextValue = {
  customers: Customer[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  isReady: boolean;
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  getCustomer: (id: string) => Customer | undefined;
  addInventoryItem: (i: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, patch: Partial<InventoryItem>) => void;
  removeInventoryItem: (id: string) => void;
  addInvoice: (inv: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  removeInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setCustomers([]);
      setInventory([]);
      setInvoices([]);
      setLoaded(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const snap = await dataApi.loadSnapshot(user.id);
      if (cancelled) return;
      setCustomers(snap.customers);
      setInventory(snap.inventory);
      setInvoices(snap.invoices);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user || !loaded) return;
    dataApi
      .saveSnapshot(user.id, { customers, inventory, invoices })
      .catch(() => {});
  }, [customers, inventory, invoices, user, loaded]);

  const addCustomer = useCallback((c: Omit<Customer, 'id' | 'createdAt'>) => {
    setCustomers((prev) => [
      ...prev,
      { ...c, id: `c_${Date.now()}`, createdAt: new Date().toISOString() },
    ]);
  }, []);

  const updateCustomer = useCallback((id: string, patch: Partial<Customer>) => {
    setCustomers((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const removeCustomer = useCallback((id: string) => {
    setCustomers((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const getCustomer = useCallback(
    (id: string) => customers.find((c) => c.id === id),
    [customers]
  );

  const addInventoryItem = useCallback((i: Omit<InventoryItem, 'id'>) => {
    setInventory((prev) => [...prev, { ...i, id: `i_${Date.now()}` }]);
  }, []);

  const updateInventoryItem = useCallback((id: string, patch: Partial<InventoryItem>) => {
    setInventory((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const removeInventoryItem = useCallback((id: string) => {
    setInventory((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addInvoice = useCallback((inv: Omit<Invoice, 'id' | 'createdAt'>) => {
    setInvoices((prev) => [
      ...prev,
      { ...inv, id: `inv_${Date.now()}`, createdAt: new Date().toISOString() },
    ]);
  }, []);

  const updateInvoice = useCallback((id: string, patch: Partial<Invoice>) => {
    setInvoices((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const updateInvoiceStatus = useCallback((id: string, status: Invoice['status']) => {
    setInvoices((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
  }, []);

  const removeInvoice = useCallback((id: string) => {
    setInvoices((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const getInvoice = useCallback(
    (id: string) => invoices.find((i) => i.id === id),
    [invoices]
  );

  return (
    <AppDataContext.Provider
      value={{
        customers,
        inventory,
        invoices,
        isReady: loaded,
        addCustomer,
        updateCustomer,
        removeCustomer,
        getCustomer,
        addInventoryItem,
        updateInventoryItem,
        removeInventoryItem,
        addInvoice,
        updateInvoice,
        updateInvoiceStatus,
        removeInvoice,
        getInvoice,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}

export type { Customer, InventoryItem, Invoice } from '@/services/types';
