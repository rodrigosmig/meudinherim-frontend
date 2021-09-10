
export const toCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export const toBrDate = (date: string) => {
  return date.split('-').reverse().join('/')
}