'use client';

import { listAccounts } from "@/services/accounts-service";
import { useEffect, useState } from "react";

type Account = {
  id: string;
  name: string;
  balance: number;
};

export default function ContasPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccounts() {
      setLoading(true);
      setError("");

      const response = await listAccounts();

      if (!response.ok) {
        setError(response.message || "Erro ao carregar contas.");
        setLoading(false);
        return;
      }

      setAccounts(response.data);
      setLoading(false);
    }

    loadAccounts();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold text-white">Contas</h1>

      {loading && <p className="text-gray-400">Carregando contas...</p>}
      {!!error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-2">
          {accounts.map((account) => (
            <li key={account.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-white font-medium">{account.name}</p>
              <p className="text-gray-400">Saldo: {account.balance}</p>
            </li>
          ))}

          {accounts.length === 0 && <p className="text-gray-400">Nenhuma conta encontrada.</p>}
        </ul>
      )}
    </section>
  );
}
