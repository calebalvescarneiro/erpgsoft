import { useMemo, useState } from 'react';
import { useCatalogStore } from './catalog.store';

export function CatalogView() {
  const items = useCatalogStore((state) => state.items);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return items.filter((item) =>
      `${item.name} ${item.sku}`.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [items, search]);

  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Catálogo Básico</h1>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar produto..."
          className="border border-slate-200 rounded-md px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-slate-700">{item.name}</h2>
            <p className="text-sm text-slate-500">SKU: {item.sku}</p>
            <p className="text-lg text-emerald-600 font-bold mt-2">
              {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <button className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-md font-semibold">
              Adicionar à venda
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
