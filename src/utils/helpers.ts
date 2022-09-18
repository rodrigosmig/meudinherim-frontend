import { createStandaloneToast  } from '@chakra-ui/react';
import { format } from 'date-fns';
import { theme } from '../styles/theme';

//cache keys constants
export const CARDS = "cards";
export const CARDS_FORM = "cards_form";
export const INVOICE = "invoice";
export const INVOICES = "invoices";
export const INVOICE_ENTRIES = "invoice_entries";
export const OPEN_INVOICES = "open_invoices";
export const ACCOUNTS = "accounts";
export const ACCOUNTS_FORM = "accounts_form";
export const ACCOUNTS_ENTRIES = "account_entries";
export const ACCOUNT_BALANCE = "account_balance";
export const ACCOUNT_TOTAL_BY_CATEGORY = "account_total_by_category";
export const CREDIT_TOTAL_BY_CATEGORY = "credit_total_by_category";
export const ACCOUNTS_REPORT = "accounts_report";
export const PAYABLES = "payables";
export const RECEIVABLES = "receivables";
export const CATEGORIES = "categories";
export const CATEGORIES_FORM = "categories-form";

export const toCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export const toBrDate = (date: string) => {
  return date?.split('-').reverse().join('/')
}

export const reverseBrDate = (date: string) => {
  return date?.split('/').reverse().join('-')
}

export const toUsDate = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
}

export const getMessage = (
  title: string,
  description: string,
  status: 'success' | 'error' | 'warning' = 'success',
  duration: number = 3000
) => {
  const toast = createStandaloneToast({theme: theme})
  
  toast({
    title: title,
    description: description,
    position: "top-right",
    status: status,
    duration: duration,
    isClosable: true,
  })
}

export const isDevelopment = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';
}