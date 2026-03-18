import { cn } from "@/helpers/string-helper";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectPrimitive.SelectProps {
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Select({ children, className, placeholder, ...props }: SelectProps) {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        className={cn(
          "flex w-full h-10 items-center justify-between gap-2 bg-card hover:bg-gray-900 border border-default-border rounded-lg px-3 py-2 text-base text-default-text focus:outline-none focus:ring-2 focus:ring-purple-500",
          className
        )}>
        <span className="truncate max-w-40 md:max-w-none">
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-default-text" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>


      <SelectPrimitive.Portal>
        <SelectPrimitive.Content side="bottom" position="popper" sideOffset={4}
          className="w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-sm">
          <SelectPrimitive.Viewport className="outline-none divide-y divide-gray-600">
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}