import { useMemo } from 'react';
import { OfflineBadge } from './components/OfflineBadge';
import { LoginForm } from './modules/login/LoginForm';
import { CashierSelector } from './modules/cashier/CashierSelector';
import { CatalogView } from './modules/catalog/CatalogView';
import { useSessionStore } from './modules/session/session.store';

export function App() {
  const tenantId = useSessionStore((state) => state.tenantId);
  const accessToken = useSessionStore((state) => state.accessToken);
  const cashierId = useSessionStore((state) => state.cashierId);

  const step = useMemo(() => {
    if (!accessToken) return 'login';
    if (!cashierId) return 'cashier';
    return 'catalog';
  }, [accessToken, cashierId]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4 space-y-6">
      <OfflineBadge />
      {step === 'login' && <LoginForm onSuccess={() => undefined} />}
      {step === 'cashier' && <CashierSelector onSelect={() => undefined} />}
      {step === 'catalog' && (
        <div className="space-y-4 w-full flex flex-col items-center">
          <header className="w-full max-w-4xl flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-800">PDV ERPG</h1>
              <p className="text-sm text-slate-500">
                Operando como <strong>{tenantId}</strong> no caixa <strong>{cashierId}</strong>
              </p>
            </div>
            <button
              onClick={() => useSessionStore.getState().clear()}
              className="text-sm text-red-600 underline"
            >
              Encerrar sessão
            </button>
          </header>
          <CatalogView />
        </div>
      )}
    </div>
  );
}
