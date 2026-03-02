'use client';

import { useContas } from "@/hooks/use-contas";
import { useNotificacoes } from "@/hooks/use-notificacoes";
import { useProximasFaturas } from "@/hooks/use-proximas-faturas";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const queryClient = useQueryClient();
  const { data: accounts, isLoading, error } = useContas();
  const { data: notificacoes, isLoading: notificacoesLoading, error: notificacoesError } = useNotificacoes();
  const { data: proximasFaturas, isLoading: proximasFaturasLoading, error: proximasFaturasError } = useProximasFaturas();

  function testeButton() {
    queryClient.invalidateQueries({ queryKey: ['contas'] });
  }

  if (isLoading || proximasFaturasLoading) {
    return <div>Carregando...</div>;
  }

  if (error || proximasFaturasError) {
    return <div>Erro ao carregar dados</div>;
  }

  return (
    <div>
      Dashboard

    </div>
  )
}
