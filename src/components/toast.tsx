// src/components/toast.ts
import { toast as toastSonner } from 'sonner';

const DEFAULT_DURATION = 1000;

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

export const toast = {
  error,
  success,
  warning,
}