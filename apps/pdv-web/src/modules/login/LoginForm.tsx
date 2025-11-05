import { FormEvent, useState } from 'react';
import axios from 'axios';
import { useSessionStore } from '../session/session.store';

interface Props {
  onSuccess(): void;
}

export function LoginForm({ onSuccess }: Props) {
  const [email, setEmail] = useState('demo@erpgsoft.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [tenantId, setTenantId] = useState('demo-retail');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useSessionStore((state) => state.setAuth);
  const setTenant = useSessionStore((state) => state.setTenant);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AUTH_URL ?? 'http://localhost:3001'}/auth/login`,
        { email, password },
        {
          headers: {
            'x-tenant-id': tenantId
          }
        }
      );
      setTenant(tenantId);
      setAuth(response.data.accessToken);
      onSuccess();
    } catch (err) {
      setError('Falha na autenticação. Verifique suas credenciais.');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded-lg p-6 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium text-slate-600">Tenant</label>
        <input
          value={tenantId}
          onChange={(event) => setTenantId(event.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2"
          placeholder="Identificador do tenant"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">E-mail</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2"
          placeholder="seu@email.com"
          required
          type="email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Senha</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2"
          placeholder="••••••••"
          required
          type="password"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-2 rounded-md font-semibold hover:bg-emerald-500"
      >
        {loading ? 'Entrando...' : 'Entrar no PDV'}
      </button>
    </form>
  );
}
