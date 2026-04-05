import * as SelectPrimitive from "@radix-ui/react-select";
import { ElementType, useId, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/helpers/string-helper";

interface SelectProps extends SelectPrimitive.SelectProps {
  id?: string;
  icon?: ElementType;
  label?: string;
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
}

function SelectRoot({ id, icon: Icon, label, children, className, placeholder, ...props }: SelectProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerId = id ?? useId();

  return (
    <SelectPrimitive.Root {...props}>
      <div className="flex flex-col gap-1">
        {label && <label htmlFor={triggerId} className="mb-1">{label}</label>}
        <SelectPrimitive.Trigger
          id={triggerId}
          ref={triggerRef}
          className={cn(
            "flex w-full h-10 items-center justify-between gap-2 bg-card hover:bg-gray-900 border border-default-border rounded-lg px-3 py-2 text-base text-input-text data-placeholder:text-default-placeholder focus:outline-none focus:ring-2 focus:ring-primary",
            className
          )}>

          <div className="flex items-center gap-2">
            {Icon && <Icon className="text-gray-500 w-4 h-4 md:w-5 md:h-5 shrink-0" />}
            <span className="truncate max-w-40 md:max-w-none">
              <SelectPrimitive.Value placeholder={placeholder} />
            </span>
          </div>

          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-default-text" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
      </div>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="z-60 w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-sm">

          <SelectPrimitive.Viewport className="max-h-(--radix-select-content-available-height) overflow-y-auto outline-none divide-y divide-gray-600">
            {children}
          </SelectPrimitive.Viewport>

        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

interface SelectGroupProps extends SelectPrimitive.SelectGroupProps {
  label: string;
  className?: string;
}

function SelectGroup({ label, children, className }: SelectGroupProps) {
  return (
    <SelectPrimitive.Group>
      <SelectPrimitive.Label className={cn(className, "bg-gray-700 px-3 py-2 text-lg font-semibold text-gray-500 italic")}>
        {label}
      </SelectPrimitive.Label>
      {children}
    </SelectPrimitive.Group>
  );
}

interface SelectItemProps extends SelectPrimitive.SelectItemProps {
  text: string;
  className?: string;
}

function SelectItem({ text, className, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "flex items-center justify-between gap-2 px-3 py-2.5 outline-none bg-gray-700 data-highlighted:bg-purple-500 cursor-default text-xs md:text-base",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="text-xs md:text-base" asChild>
        <span>{text}</span>
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-cyan-200" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export const SelectOld = {
  Root: SelectRoot,
  Group: SelectGroup,
  Item: SelectItem,
}