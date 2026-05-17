'use client';

import { InlineFetchingIndicator } from '@/components/primitives/fetching-indicator';
import { useConfiguracaoInicial } from '@/hooks/use-configuracao-inicial';
import type { ReactNode } from 'react';

type DataProviderProps = {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
};

export function InitialConfigDataProvider({
  children,
  loadingFallback,
  errorFallback,
}: DataProviderProps) {
  const { isLoading, isError, isFetching } = useConfiguracaoInicial();

  if (isLoading) {
    return loadingFallback ?? <DefaultLoadingScreen />;
  }

  if (isError) {
    return errorFallback ?? <DefaultErrorScreen />;
  }

  return (
    <>
      {children}
      {isFetching && <InlineFetchingIndicator />}
    </>
  );
}

function DefaultLoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400">Carregando dados...</span>
      </div>
    </div>
  );
}

function DefaultErrorScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-red-500 text-xl">Erro ao carregar dados</span>
        <span className="text-gray-400">
          Não foi possível carregar os dados. Tente novamente mais tarde.
        </span>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-500 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
