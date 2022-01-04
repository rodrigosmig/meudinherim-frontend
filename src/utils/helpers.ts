import { createStandaloneToast  } from '@chakra-ui/react';
import { format } from 'date-fns';
import { theme } from '../styles/theme';

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
  status: 'success' | 'error' = 'success'
) => {
  const toast = createStandaloneToast({theme: theme})

  toast({
    title: title,
    description: description,
    position: "top-right",
    status: status,
    duration: 3000,
    isClosable: true,
  })
}