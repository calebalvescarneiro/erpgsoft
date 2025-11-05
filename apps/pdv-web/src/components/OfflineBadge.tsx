import { useOfflineStatus } from '../hooks/useOfflineStatus';

export function OfflineBadge() {
  const isOffline = useOfflineStatus();
  if (!isOffline) return null;
  return (
    <div className="bg-amber-500 text-white text-sm px-3 py-2 rounded-md shadow-md">
      Modo offline ativo. Novas vendas serão sincronizadas quando a conexão retornar.
    </div>
  );
}
