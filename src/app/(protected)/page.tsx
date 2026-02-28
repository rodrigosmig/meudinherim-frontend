'use client';

import { useAccounts } from "@/hooks/use-accounts";

export default function Home() {
  const { data: accounts, isLoading, error } = useAccounts();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar contas</div>;
  }

  return (
    <div>
      {accounts?.contas.map((account) => (
        <div key={account.uuid}>{account.nome} - Saldo: {account.saldo}</div>

      ))}
    </div>
  )
}
