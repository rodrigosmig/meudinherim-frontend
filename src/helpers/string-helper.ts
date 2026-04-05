import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(text: string, locale = "pt-BR"): string {
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}

export const toCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const toBrDate = (date: string) => {
  return date?.split("-").reverse().join("/");
};

export const reverseBrDate = (date: string) => {
  return date?.split("/").reverse().join("-");
};

export const toUsDate = (date: Date) => {
  if (!date) return "";

  return format(date, "yyyy-MM-dd");
};

export const toStringBrDate = (date: Date) => {
  return format(date, "dd/MM/yyyy");
};
