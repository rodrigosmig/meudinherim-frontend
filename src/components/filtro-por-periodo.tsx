import { DropdownMenu } from "@/components/primitives/dropdown-menu";
import { cn } from "@/helpers/string-helper";
import { useDateFilter } from "@/hooks/use-date-filter";
import { ptBR } from "date-fns/locale/pt-BR";
import { Calendar, Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange, DayPicker, OnSelectHandler } from "react-day-picker";

import { Button } from "./primitives/button";

type FiltroPorPeriodoProps = {
  selectedRange: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  onClickFilter: () => void;
};

export default function FiltroPorPeriodo({
  selectedRange,
  onRangeChange,
  onClickFilter
}: FiltroPorPeriodoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rangeString, setRangeString] = useState("");
  const [month, setMonth] = useState<Date>(new Date());
  const { stringDateBR } = useDateFilter()
  const showClosingButton = !!stringDateBR?.from || !!stringDateBR?.to;

  const handleSelect: OnSelectHandler<DateRange | undefined> = (range) => {
    onRangeChange(range);

    if (range && range?.from && range?.to) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const from = stringDateBR.from ? stringDateBR.from : "";
    const to = stringDateBR.to ? stringDateBR.to : "";

    if (from || to) {
      setRangeString(`${from} - ${to}`);
    }
    else {
      setRangeString("");
    }
  }, [stringDateBR]);

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu.Root open={isOpen} onOpenChange={(open) => {
        if (open && selectedRange?.from) {
          setMonth(selectedRange.from);
        }
        setIsOpen(open);
      }}>
        <div className={cn("relative flex w-64 md:w-68 items-center gap-2 ",
          "rounded-lg border border-default-border bg-gray-800 px-3 py-2 hover:bg-gray-900 cursor-pointer"
        )}>
          <DropdownMenu.Trigger>
            <div className="w-full flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500 md:h-5 md:w-5" />
              <input
                type="text"
                placeholder="Filtrar por período"
                value={rangeString}
                readOnly
                className="w-full bg-transparent placeholder-default-placeholder outline-none cursor-pointer text-input-text text-sm md:text-base"
              />
            </div>
          </DropdownMenu.Trigger>

          {showClosingButton && (
            <button
              type="button"
              aria-label="Limpar período"
              className={cn("absolute right-3 top-1/2 -translate-y-1/2 inline-flex cursor-pointer",
                "h-3 w-3 md:h-4 md:w-4 items-center justify-center rounded-full p-1",
                "bg-primary hover:bg-secondary p-0 shrink-0",
                "transition-colors"
              )}
              onClick={(event) => {
                event.stopPropagation();
                onRangeChange(undefined);
              }}
            >
              <X className="h-2 w-2 md:h-3 md:w-3" strokeWidth={2.5} />
            </button>
          )}

        </div>

        <DropdownMenu.Content align="center" className="border-default-border bg-gray-700 p-0">
          <div className="scale-85">
            <DayPicker
              animate
              mode="range"
              resetOnSelect
              showOutsideDays
              captionLayout="dropdown"
              navLayout="around"
              reverseYears
              locale={ptBR}
              month={month}
              onMonthChange={setMonth}
              selected={selectedRange}
              onSelect={handleSelect}
              className="periodo-day-picker"
            />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root >

      <Button
        tooltip="Filtrar por período"
        icon={Filter}
        className="h-9"
        onClick={onClickFilter}
      />
    </div>
  );
}