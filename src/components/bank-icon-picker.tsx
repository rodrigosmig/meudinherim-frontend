"use client";

import { BANK_ICONS } from "@/helpers/bank-icons";
import { cn } from "@/helpers/string-helper";
import { Landmark } from "lucide-react";
import { BankIcon } from "./bank-icon";

interface BankIconPickerProps {
  value: string;
  onChange: (key: string) => void;
  label?: string;
}

export function BankIconPicker({ value, onChange, label }: BankIconPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm text-gray-200">{label}</span>}
      <div className="grid grid-cols-4 md:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
        <BankOption
          bankKey=""
          name="Sem ícone"
          selected={!value}
          onClick={() => onChange("")}
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-700">
            <Landmark className="w-4 h-4 text-gray-400" />
          </span>
        </BankOption>

        {BANK_ICONS.map((bank) => (
          <BankOption
            key={bank.key}
            bankKey={bank.key}
            name={bank.name}
            selected={value === bank.key}
            onClick={() => onChange(bank.key)}
          >
            <BankIcon icon={bank.key} name={bank.name} size={36} />
          </BankOption>
        ))}
      </div>
    </div>
  );
}

interface BankOptionProps {
  bankKey: string;
  name: string;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function BankOption({ name, selected, onClick, children }: BankOptionProps) {
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
