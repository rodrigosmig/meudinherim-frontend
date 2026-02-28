import * as RadixSwitch from "@radix-ui/react-switch";
import { FieldError } from "react-hook-form";
import { cn } from "@/utils/helpers";

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof RadixSwitch.Root> {
  label?: string;
  error?: FieldError;
}

export default function Switch({
  label,
  error,
  id,
  className,
  children,
  ...props
}: SwitchProps) {
  const switchId = id || (label ? `switch-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  return (
    <div className="flex gap-4">
      {label && (
        <label className="text-gray-200 mb-1" htmlFor={switchId}>{label}</label>
      )}
      <RadixSwitch.Root
        id={switchId}
        className={cn(
          "relative w-10 h-6 flex items-center rounded-full transition-colors px-1",
          "bg-gray-700 data-[state=checked]:bg-violet-600 focus:ring-violet-500",
          className
        )}
        {...props}
      >
        <RadixSwitch.Thumb
          className={cn(
            "inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform",
            "translate-x-0 data-[state=checked]:translate-x-4"
          )}
        />
        {children}
      </RadixSwitch.Root>
    </div>
  );
}