import * as Select from "@radix-ui/react-select";
import { Check } from "lucide-react";

interface SelectItemProps extends Select.SelectItemProps {
  text: string;
}

export function SelectItem({ text, ...props }: SelectItemProps) {
  return (
    <Select.Item
      className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none bg-gray-700 data-highlighted:bg-purple-500 cursor-default text-xs md:text-base"
      {...props}
    >
      <Select.ItemText className="text-xs md:text-base" asChild>
        <span>{text}</span>
      </Select.ItemText>
      <Select.ItemIndicator>
        <Check className="h-4 w-4 text-cyan-200" />
      </Select.ItemIndicator>
    </Select.Item>
  )
}