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
  ...props
}: Readonly<InputProps>) {
  const newId = useId()
  const inputId = id ?? newId
  const isError = !!error;

  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="mb-1">{label}</label>}
      <div
        className={cn(
          "flex w-full bg-gray-800 hover:bg-gray-900 border text-xs md:text-base",
          "text-input-text items-center gap-2 rounded-lg px-3 py-2 shadow-2xs focus-within:ring-3",
          isError ? "border-red-400 focus-within:ring-red-400" : "border-default-border focus-within:ring-primary",
        )}
      >
        {Icon && <Icon className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />}
        <input
          id={inputId}
          type="text"
          className="flex-1 w-full border-0 bg-transparent p-0 placeholder-default-placeholder outline-none "
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