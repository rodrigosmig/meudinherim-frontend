import { ComponentProps, useState } from "react";
import { ptBR } from "date-fns/locale/pt-BR";
import { DayPicker } from "react-day-picker";
import { Calendar } from "lucide-react";

import { DropdownMenu } from "./dropdown-menu";
import { Input } from "./input";

interface InputDateProps extends ComponentProps<typeof Input> { }

export default function InputDate({ ...props }: InputDateProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-fullflex gap-2 items-center">
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger>
          <Input
            icon={Calendar}
            type="text"
            placeholder="Filtrar por período"
            {...props}
          />
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align="center" className="w-auto border-gray-700 bg-gray-700 p-0">
          <div className="scale-85">
            <DayPicker
              animate
              mode="single"
              captionLayout="dropdown"
              navLayout="around"
              reverseYears
              locale={ptBR}
              className="periodo-day-picker"
            />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root >

    </div>
  )
}