import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Calendar } from "lucide-react";
import { ComponentProps, useState } from "react";
import { DayPicker } from "react-day-picker";

import { DropdownMenu } from "./dropdown-menu";
import { Input } from "./input";

interface InputDateProps extends Omit<ComponentProps<typeof Input>, "value" | "onChange"> {
  dateSelected?: Date;
  onChange?: (date: Date | undefined) => void;
}

export default function InputDate({ dateSelected, onChange, ...props }: InputDateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Date | undefined>(undefined);

  const value = dateSelected ?? internalValue;

  function handleSelect(date: Date | undefined) {
    if (dateSelected === undefined) setInternalValue(date);
    onChange?.(date);
    setIsOpen(false);
  }

  return (
    <div className="w-full flex gap-2 items-center">
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <DropdownMenu.Trigger>
          <Input
            icon={Calendar}
            type="text"
            readOnly
            value={value ? format(value, "dd/MM/yyyy") : ""}
            placeholder="Selecione uma data"
            {...props}
          />
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align="center" className="w-auto border-gray-700 bg-gray-700 p-0">
          <div className="scale-85">
            <DayPicker
              animate
              mode="single"
              selected={value}
              onSelect={handleSelect}
              captionLayout="dropdown"
              navLayout="around"
              reverseYears
              locale={ptBR}
              className="periodo-day-picker periodo-day-picker-input-date"
            />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}