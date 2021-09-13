import { format } from 'date-fns';

export const toCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export const toBrDate = (date: string) => {
  return date.split('-').reverse().join('/')
}

export const toUsDate = (date: Date) => {
  return format(date, 'Y-MM-dd');
}