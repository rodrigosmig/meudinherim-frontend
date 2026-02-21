import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/helpers/utils";

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
          "flex w-full md:max-w-none h-8 md:h-10 items-center justify-between gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs md:text-base text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500",
          className
        )}>
        <span className="truncate max-w-40 md:max-w-none">
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-gray-300" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>


      <SelectPrimitive.Portal>
        <SelectPrimitive.Content side="bottom" position="popper" sideOffset={4}
          className="w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-sm">
          <SelectPrimitive.Viewport className="outline-none">
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}