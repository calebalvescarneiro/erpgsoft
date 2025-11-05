import { create } from 'zustand';
import { persistOffline, readOffline } from '../../providers/offline-cache';

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  sku: string;
  available: boolean;
}

interface CatalogState {
  items: CatalogItem[];
  setItems(items: CatalogItem[]): void;
}

const STORAGE_KEY = 'pdv_catalog';

const initialItems = readOffline<CatalogItem[]>(STORAGE_KEY, [
  { id: 'coffee', name: 'Café Espresso', price: 7.5, sku: 'CF-001', available: true },
  { id: 'sandwich', name: 'Sanduíche Natural', price: 12.9, sku: 'SD-002', available: true },
  { id: 'juice', name: 'Suco de Laranja', price: 9.9, sku: 'JC-003', available: true }
]);

export const useCatalogStore = create<CatalogState>((set) => ({
  items: initialItems,
  setItems: (items) => {
    persistOffline(STORAGE_KEY, items);
    set({ items });
  }
}));
