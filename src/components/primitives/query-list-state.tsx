'use client';

import { Button } from '@/components/primitives/button';
import Skeleton from '@/components/primitives/skeleton';
import Text from '@/components/primitives/text';
import { cn } from '@/helpers/string-helper';
import { AlertCircle, InboxIcon, RefreshCcw } from 'lucide-react';
import { ReactNode } from 'react';

type QueryListStateProps = {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  loadingFallback?: ReactNode;
  children?: ReactNode;
  containerClassName?: string;
};

type StateType = 'loading' | 'error' | 'empty' | 'content';

function getStateType({
  isLoading,
  isError,
  isEmpty,
}: {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
}): StateType {
  if (isLoading) return 'loading';
  if (isError) return 'error';
  if (isEmpty) return 'empty';
  return 'content';
}

export default function QueryListState({
  isLoading = false,
  isError = false,
  isEmpty = false,
  errorMessage = 'Erro ao carregar dados',
  emptyMessage = 'Nenhum registro encontrado',
  onRetry,
  isRetrying = false,
  loadingFallback,
  children,
  containerClassName,
}: Readonly<QueryListStateProps>) {
  const state = getStateType({ isLoading, isError, isEmpty });

  if (state === 'loading') {
    return loadingFallback ?? <DefaultLoadingState />;
  }

  if (state === 'error') {
    return (
      <div
        className={cn(
          'flex min-h-64 flex-col items-center justify-center gap-4 px-6 py-10 text-center',
          containerClassName,
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
          <AlertCircle className="h-6 w-6" aria-hidden />
        </div>

        <div className="flex max-w-lg flex-col gap-2">
          <Text
            as="h2"
            className="text-lg font-semibold text-default-text"
          >
            Erro ao carregar dados
          </Text>

          <Text className="text-center text-gray-400">{errorMessage}</Text>
        </div>

        {onRetry && (
          <Button
            icon={RefreshCcw}
            onClick={onRetry}
            isLoading={isRetrying}
          >
            Tentar novamente
          </Button>
        )}
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div
        className={cn(
          'flex min-h-64 flex-col items-center justify-center gap-4 px-6 py-10 text-center',
          containerClassName,
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-600 bg-gray-800/50 text-gray-500">
          <InboxIcon className="h-6 w-6" aria-hidden />
        </div>

        <div className="flex max-w-lg flex-col gap-2">
          <Text
            as="h2"
            className="text-lg font-semibold text-default-text"
          >
            Nenhum registro
          </Text>

          <Text className="text-center text-gray-400">
            {emptyMessage}
          </Text>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function DefaultLoadingState() {
  return (
    <div className="space-y-3 px-6 py-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
