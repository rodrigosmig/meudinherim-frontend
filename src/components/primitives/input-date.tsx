import { addYears, format } from "date-fns";
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

export default function InputDate({ dateSelected, onChange, disabled, ...props }: InputDateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date>(new Date());

  const value = dateSelected ?? internalValue;
  const destaqueDiaCorrespondente = value
    ? (date: Date) =>
        date.getFullYear() === month.getFullYear() &&
        date.getMonth() === month.getMonth() &&
        date.getDate() === value.getDate() &&
        (date.getMonth() !== value.getMonth() || date.getFullYear() !== value.getFullYear())
    : undefined;

  function handleSelect(date: Date | undefined) {
    if (dateSelected === undefined) setInternalValue(date);
    onChange?.(date);
    setIsOpen(false);
  }

  function handleOpenChange(open: boolean) {
    if (disabled && open) return;
    if (open) setMonth(value ?? new Date());
    setIsOpen(open);
  }

  return (
    <div className="w-full flex gap-2 items-center">
      <DropdownMenu.Root open={isOpen} onOpenChange={handleOpenChange} className="w-full">
        <DropdownMenu.Trigger>
          <Input
            icon={Calendar}
            type="text"
            readOnly
            disabled={disabled}
            value={value ? format(value, "dd/MM/yyyy") : ""}
            placeholder="Selecione uma data"
            {...props}
          />
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align="center" className="w-auto border-gray-700 bg-gray-700 p-0">
          <div className="scale-85">
            <DayPicker
              animate
              showOutsideDays
              mode="single"
              required
              selected={value}
              onSelect={handleSelect}
              modifiers={
                destaqueDiaCorrespondente
                  ? { "same-day-of-month": destaqueDiaCorrespondente }
                  : undefined
              }
              modifiersClassNames={{ "same-day-of-month": "rdp-same-day-of-month" }}
              month={month}
              onMonthChange={setMonth}
              endMonth={addYears(new Date(), 10)}
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