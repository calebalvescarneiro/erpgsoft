import { useState, type FormEvent } from 'react';
import { useSessionStore } from '../session/session.store';

const CASHIERS = [
  { id: 'front-01', name: 'Caixa Principal' },
  { id: 'front-02', name: 'Caixa Secundário' }
];

interface Props {
  onSelect(): void;
}

export function CashierSelector({ onSelect }: Props) {
  const selectCashier = useSessionStore((state) => state.selectCashier);
  const selected = useSessionStore((state) => state.cashierId);
  const [localSelection, setLocalSelection] = useState(selected ?? CASHIERS[0].id);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    selectCashier(localSelection);
    onSelect();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md w-full">
      <div>
        <h2 className="text-xl font-semibold text-slate-700">Selecione o Caixa</h2>
        <p className="text-sm text-slate-500">Escolha o terminal que você está operando neste momento.</p>
      </div>
      <div className="space-y-2">
        {CASHIERS.map((cashier) => (
          <label key={cashier.id} className="flex items-center space-x-2">
            <input
              type="radio"
              name="cashier"
              value={cashier.id}
              checked={localSelection === cashier.id}
              onChange={() => setLocalSelection(cashier.id)}
            />
            <span>{cashier.name}</span>
          </label>
        ))}
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white rounded-md py-2 font-semibold">
        Entrar no catálogo
      </button>
    </form>
  );
}
