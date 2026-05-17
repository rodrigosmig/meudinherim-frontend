import { ComponentProps, useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { Banknote } from 'lucide-react';

import { Input } from './input';

interface InputMoneyProps extends Omit<ComponentProps<'input'>, 'onChange' | 'value'> {
  className?: string;
  label?: string;
  error?: FieldError;
  onChange?: (value: number | undefined) => void;
  value?: number;
}

export function InputMoney({ label, error, className, onChange, value: externalValue, ...props }: InputMoneyProps) {
  const [digits, setDigits] = useState<string>(
    externalValue != null ? String(Math.round(externalValue * 100)) : ''
  );

  useEffect(() => {
    setDigits(externalValue != null ? String(Math.round(externalValue * 100)) : "");
  }, [externalValue]);

  const formatDisplay = (d: string): string => {
    if (!d) return '';
    const padded = d.padStart(3, '0'); // mínimo 3 dígitos para ter "0,XX"
    const intPart = padded.slice(0, -2).replace(/^0+/, '') || '0';
    const decPart = padded.slice(-2);
    const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${intFormatted},${decPart}`;

  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const next = digits.slice(0, -1);
      setDigits(next);
      onChange?.(next ? parseInt(next, 10) / 100 : undefined);
      return;
    }

    if (!/^\d$/.test(e.key)) return;

    e.preventDefault();

    const next = digits + e.key;
    setDigits(next);
    onChange?.(parseInt(next, 10) / 100);
  };

  return (
    <div className="flex flex-col gap-1">
      <Input
        label={label}
        icon={Banknote}
        inputMode="numeric"
        placeholder="R$ 0,00"
        value={formatDisplay(digits)}
        onKeyDown={handleKeyDown}
        readOnly
        error={error}
        {...props}
      />
    </div>

  );
}