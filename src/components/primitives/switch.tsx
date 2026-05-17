import { cn } from "@/helpers/string-helper";
import * as RadixSwitch from "@radix-ui/react-switch";
import { FieldError } from "react-hook-form";

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof RadixSwitch.Root> {
  label?: string;
  error?: FieldError;
}

export default function Switch({
  label,
  error,
  id,
  className,
  disabled,
  children,
  ...props
}: SwitchProps) {
  const switchId = id || (label ? `switch-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  return (
    <div className={cn("flex items-center justify-between w-full", disabled && "cursor-not-allowed")}>
      {label && (
        <label
          className={cn(
            "text-gray-200 select-none",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          )}
          htmlFor={switchId}
        >
          {label}
        </label>
      )}
      <RadixSwitch.Root
        id={switchId}
        disabled={disabled}
        className={cn(
          "relative w-10 h-6 flex items-center rounded-full transition-colors px-1 shrink-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          disabled
            ? "bg-gray-700/50 cursor-not-allowed"
            : "bg-gray-700 data-[state=checked]:bg-purple-600 cursor-pointer",
          className,
        )}
        {...props}
      >
        <RadixSwitch.Thumb
          className={cn(
            "inline-block w-4 h-4 rounded-full shadow transform transition-transform",
            "translate-x-0 data-[state=checked]:translate-x-4",
            disabled ? "bg-gray-500" : "bg-white",
          )}
        />
        {children}
      </RadixSwitch.Root>
    </div>
  );
}
