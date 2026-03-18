"use client";

import { cn } from "@/helpers/string-helper";
import { LoaderCircle } from "lucide-react";
import { ComponentProps, ElementType, ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

import Tooltip from "./tooltip";

const buttonVariants = tv({
  base: [
    "flex items-center justify-center gap-2 px-2 py-2 text-xs md:text-sm font-semibold transition-colors rounded-md"
  ],
  variants: {
    variant: {
      primary: [
        "bg-primary text-default-text hover:bg-button-hover hover:text-primary active:bg-secondary active:text-default-text border border-primary/50 ",
      ],
      pagination: [
        "w-7 h-7 bg-transparent border border-primary hover:bg-purple-600 text-primary hover:text-default-text",
      ],
      icon: [
        "p-2 hover:bg-gray-800 rounded-lg transition-colors relative",
      ],
      back: [
        "relative w-6 h-6 p-4 border border-gray-700 hover:text-primary rounded-md transition-colors",
      ],
    },
    disabled: {
      false: "cursor-pointer",
      true: "opacity-50 cursor-not-allowed bg-gray-800 text-gray-500 border-gray-700 hover:bg-gray-800 hover:text-gray-500",
    }
  },
  defaultVariants: {
    variant: 'primary',
    disabled: false,
  },
});

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  icon?: ElementType;
  iconClassName?: string;
  children?: ReactNode;
  tooltip?: string;
  isLoading?: boolean;
}

export function Button({
  children,
  icon: Icon,
  iconClassName,
  variant,
  className,
  tooltip,
  isLoading,
  ...props }: ButtonProps) {
  return (
    <Tooltip label={tooltip}>
      <button className={buttonVariants({ variant, className, disabled: props.disabled })}
        {...props}
      >
        {Icon && <Icon className={cn("w-4 h-4", iconClassName)} />}
        {isLoading
          ? <LoaderCircle className="w-4 h-4 animate-spin" />
          : children && <span>{children}</span>
        }

      </button>
    </Tooltip>
  )
}