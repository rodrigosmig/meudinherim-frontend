import { ComponentProps, useState } from 'react';
import { FieldError } from 'react-hook-form';

import { Input } from './input';

interface InputMoneyProps extends Omit<ComponentProps<'input'>, 'onChange' | 'value'> {
  className?: string;
  label?: string;
  error?: FieldError;
  onChange?: (value: number) => void;
  value?: number;
}

export default function InputMoney({ label, error, className, onChange, value: externalValue, ...props }: InputMoneyProps) {
  const isError = !!error;
  const [digits, setDigits] = useState<string>(
    externalValue != null ? String(Math.round(externalValue * 100)) : ''
  );

  const formatDisplay = (d: string): string => {
    if (!d) return '';
    const padded = d.padStart(3, '0'); // mínimo 3 dígitos para ter "0,XX"
    const intPart = padded.slice(0, -2).replace(/^0+/, '') || '0';
    const decPart = padded.slice(-2);
    const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${intFormatted},${decPart}`;

  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      setDigits(prev => {
        const next = prev.slice(0, -1);
        onChange?.(next ? parseInt(next, 10) / 100 : 0);
        return next;
      });
      return;
    }

    if (!/^\d$/.test(e.key)) return;

    e.preventDefault();
    setDigits(prev => {
      const next = prev + e.key;
      onChange?.(parseInt(next, 10) / 100);
      return next;
    });
  };

  return (
    <Input
      label={label}
      inputMode="numeric"
      placeholder="R$ 0,00"
      value={formatDisplay(digits)}
      onKeyDown={handleKeyDown}
      error={error}
      {...props}
    />
  );
}