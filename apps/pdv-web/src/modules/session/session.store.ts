import { create } from 'zustand';
import { persistOffline, readOffline } from '../../providers/offline-cache';

export interface SessionState {
  tenantId: string | null;
  accessToken: string | null;
  cashierId: string | null;
  setTenant(tenantId: string): void;
  setAuth(token: string): void;
  selectCashier(id: string): void;
  clear(): void;
}

const STORAGE_KEY = 'pdv_session';

const initialState = readOffline<Pick<SessionState, 'tenantId' | 'accessToken' | 'cashierId'>>(STORAGE_KEY, {
  tenantId: null,
  accessToken: null,
  cashierId: null
});

export const useSessionStore = create<SessionState>((set) => ({
  ...initialState,
  setTenant: (tenantId) => {
    set((state) => {
      const next = { ...state, tenantId };
      persistOffline(STORAGE_KEY, next);
      return next;
    });
  },
  setAuth: (accessToken) => {
    set((state) => {
      const next = { ...state, accessToken };
      persistOffline(STORAGE_KEY, next);
      return next;
    });
  },
  selectCashier: (cashierId) => {
    set((state) => {
      const next = { ...state, cashierId };
      persistOffline(STORAGE_KEY, next);
      return next;
    });
  },
  clear: () => {
    set(() => {
      const next = { tenantId: null, accessToken: null, cashierId: null };
      persistOffline(STORAGE_KEY, next);
      return next;
    });
  }
}));
