'use client';

import { toast as toastSonner } from 'sonner';

const DEFAULT_DURATION = 4000; // 6 segundos
const DEFAULT_POSITION = "top-center";

type Position = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

export function error(message: string, duration: number = DEFAULT_DURATION, position: Position = DEFAULT_POSITION) {
  toastSonner.error(message, {
    duration: duration,
    position: position,
  });
}

export function success(message: string, duration: number = DEFAULT_DURATION, position: Position = DEFAULT_POSITION) {
  toastSonner.success(message, {
    duration: duration,
    position: position,
  });
}

export function warning(message: string, duration: number = DEFAULT_DURATION, position: Position = DEFAULT_POSITION) {
  toastSonner.warning(message, {
    duration: duration,
    position: position,
  });
}

export const toast = {
  error,
  success,
  warning
}