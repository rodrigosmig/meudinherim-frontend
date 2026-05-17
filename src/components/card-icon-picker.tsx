"use client";

import { BANK_ICONS } from "@/helpers/bank-icons";
import { cn } from "@/helpers/string-helper";
import { CreditCard } from "lucide-react";
import { BankIcon } from "./bank-icon";

interface CardIconPickerProps {
  value: string;
  onChange: (key: string) => void;
  label?: string;
}

export function CardIconPicker({ value, onChange, label }: CardIconPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm text-gray-200">{label}</span>}
      <div className="grid grid-cols-4 md:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
        <CardOption
          cardKey=""
          name="Sem ícone"
          selected={!value}
          onClick={() => onChange("")}
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-700">
            <CreditCard className="w-4 h-4 text-gray-400" />
          </span>
        </CardOption>

        {BANK_ICONS.map((bank) => (
          <CardOption
            key={bank.key}
            cardKey={bank.key}
            name={bank.name}
            selected={value === bank.key}
            onClick={() => onChange(bank.key)}
          >
            <BankIcon icon={bank.key} name={bank.name} size={36} />
          </CardOption>
        ))}
      </div>
    </div>
  );
}

interface CardOptionProps {
  cardKey: string;
  name: string;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function CardOption({ name, selected, onClick, children }: CardOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-150 cursor-pointer",
        "hover:bg-gray-800",
        selected
          ? "border-primary ring-2 ring-primary bg-primary/10"
          : "border-gray-700 bg-transparent",
      )}
    >
      {children}
      <span className="text-[10px] text-gray-400 text-center leading-tight line-clamp-1 w-full">
        {name}
      </span>
    </button>
  );
}
