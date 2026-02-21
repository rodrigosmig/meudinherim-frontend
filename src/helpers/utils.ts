import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(text?: string, locale = "pt-BR"): string {
  if (!text) return "";
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}
