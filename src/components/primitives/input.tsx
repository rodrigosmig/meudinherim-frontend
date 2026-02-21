import { ComponentProps, ElementType } from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/helpers/utils";

import Text from "./text";

interface InputProps extends ComponentProps<"input"> {
  icon?: ElementType;
  label?: string;
  error?: FieldError;
}

export function Input({
  icon: Icon,
  label,
  error,
  ...props
}: InputProps) {
  const isError = !!error;

  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={label} className="text-gray-200 mb-1">{label}</label>}
      <div
        className={cn(
          "flex w-full text-xs md:text-base bg-gray-800 border border-gray-700 items-center gap-2 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus:border-transparent",
          isError ? "focus-within:ring-red-800" : "focus-within:ring-violet-500",
        )}
      >
        {Icon && <Icon className="text-gray-400 w-4 md:w-5 h-4 md:h-5" />}
        <input
          id={label}
          type="text"
          className="flex-1 w-full border-0 bg-transparent p-0 text-gray-300 placeholder-gray-600 outline-none"
          {...props}
        />
      </div>
      {!!isError && (
        <Text className="pt-1 text-sm text-red-500">
          {error.message?.toString()}
        </Text>
      )}
    </div>


  );
}