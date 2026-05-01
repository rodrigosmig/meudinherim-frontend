"use client";

import { cn } from "@/helpers/string-helper";
import { ComponentProps, ElementType, useId } from "react";
import { FieldError } from "react-hook-form";

import Text from "./text";

interface InputProps extends ComponentProps<"input"> {
  icon?: ElementType;
  label?: string;
  error?: FieldError;
}

export function Input({
  id,
  icon: Icon,
  label,
  error,
  disabled,
  ...props
}: Readonly<InputProps>) {
  const newId = useId();
  const inputId = id ?? newId;
  const isError = !!error;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "mb-1",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex w-full border text-xs md:text-base text-input-text items-center gap-2 rounded-lg px-3 py-2 shadow-2xs",
          disabled
            ? "bg-gray-800/40 border-gray-700/40 cursor-not-allowed opacity-60"
            : [
                "bg-gray-800 hover:bg-gray-900 focus-within:ring-3",
                isError
                  ? "border-red-400 focus-within:ring-red-400"
                  : "border-default-border focus-within:ring-primary",
              ],
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "w-4 h-4 md:w-5 md:h-5 shrink-0",
              disabled ? "text-gray-600" : "text-gray-500",
            )}
          />
        )}
        <input
          id={inputId}
          type="text"
          disabled={disabled}
          className={cn(
            "flex-1 w-full border-0 bg-transparent p-0 outline-none",
            disabled
              ? "cursor-not-allowed text-gray-500 placeholder-gray-600"
              : "placeholder-default-placeholder",
          )}
          {...props}
        />
      </div>
      {isError && (
        <Text className="pt-1 text-sm text-error">
          {error.message?.toString()}
        </Text>
      )}
    </div>
  );
}
