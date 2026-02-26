'use client';

import { toast as toastSonner } from 'sonner';

const DEFAULT_DURATION = 8000; // 8 segundos

export function error(message: string, duration?: number) {
  toastSonner.error(message, {
    duration: duration ?? DEFAULT_DURATION,
  });
}

export function success(message: string, duration?: number) {
  toastSonner.success(message, {
    duration: duration ?? DEFAULT_DURATION,
  });
}

export function warning(message: string, duration?: number) {
  toastSonner.warning(message, {
    duration: duration ?? DEFAULT_DURATION,
  });
}

export function promise<T>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string | ((err: any) => any); }
) {
  return toastSonner.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    }
  );
}

export const toast = {
  error,
  success,
  warning,
  promise
}