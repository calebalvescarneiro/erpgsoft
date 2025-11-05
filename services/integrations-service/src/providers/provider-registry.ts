export type ProviderCategory = 'DELIVERY' | 'MESSAGING' | 'ECOMMERCE' | 'PAYMENTS';

export interface ProviderDescriptor {
  id: string;
  name: string;
  category: ProviderCategory;
  capabilities: string[];
  documentationUrl: string;
  metadata?: Record<string, unknown>;
}

export const PROVIDERS: ProviderDescriptor[] = [
  {
    id: 'ifood',
    name: 'iFood',
    category: 'DELIVERY',
    capabilities: ['menu-sync', 'order-webhook', 'status-update'],
    documentationUrl: 'https://developer.ifood.com.br/'
  },
  {
    id: 'whatsapp-business',
    name: 'WhatsApp Business',
    category: 'MESSAGING',
    capabilities: ['notification', 'payment-link'],
    documentationUrl: 'https://developers.facebook.com/docs/whatsapp'
  },
  {
    id: 'gsoft-cardapio',
    name: 'Gsoft Cardápio Online',
    category: 'ECOMMERCE',
    capabilities: ['menu-hosting', 'qr-code', 'pickup-order'],
    documentationUrl: 'https://gsoft.com.br/docs/cardapio'
  },
  {
    id: 'stone-payments',
    name: 'Stone',
    category: 'PAYMENTS',
    capabilities: ['pos-tef', 'split', 'anticipation'],
    documentationUrl: 'https://developers.stone.com.br/'
  }
];

export function findProvider(providerId: string) {
  const provider = PROVIDERS.find((candidate) => candidate.id === providerId);
  if (!provider) {
    throw new Error(`Provider ${providerId} not registered`);
  }
  return provider;
}
