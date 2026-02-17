import { cn } from "@/lib/utils";
import { ComponentProps, ElementType, ReactNode } from "react";
import { tv } from "tailwind-variants";

import Tooltip from "./tooltip";

const buttonVariants = tv({
  base: [
    "flex items-center justify-center gap-2 px-2 py-2 text-xs md:text-sm font-bold hover:text-white transition-colors cursor-pointer transition-colors rounded-md transition-all"
  ],
  variants: {
    variant: {
      primary: [
        "text-white bg-violet-600 border border-violet-500/50 hover:bg-violet-400",
      ],
      edit: [
        "text-violet-500 border border-violet-500/50 hover:bg-violet-500",
      ],
      remove: [
        "text-red-400 border border-red-400/50 hover:bg-red-400",
      ],
      info: [
        "text-green-500 border border-green-500/50 hover:bg-green-500",
      ],
      cancel: [
        "text-zinc-300 border border-zinc-300/50 hover:bg-zinc-600",
      ],
      pagination: [
        "bg-gray-800 hover:bg-gray-700 w-8 h-8 text-gray-400",
      ],
      menu: [
        "md:hidden fixed top-4 left-4 z-50 bg-gray-900 p-2 rounded-lg border border-gray-800 text-gray-300 shadow-lg"
      ],
      close: [
        "absolute top-0 right-0 md:hidden text-gray-400 hover:text-white font-bold"
      ]
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

interface ButtonProps extends ComponentProps<'button'> {
  variant?: "primary" | "edit" | "remove" | "info" | "cancel" | "pagination" | "menu" | "close";
  icon?: ElementType;
  iconClassName?: string;
  children?: ReactNode;
  tooltip?: string;
}

export function Button({
  children,
  icon: Icon,
  iconClassName,
  variant,
  className,
  tooltip,
  ...props }: ButtonProps) {
  return (
    <Tooltip label={tooltip}>
      <button className={buttonVariants({ variant, className })}
        {...props}
      >
        {Icon && <Icon className={cn("w-4 h-4 md:w-5 md:h-5", iconClassName)} />}
        {children && <span>{children}</span>}
      </button>
    </Tooltip>
  )
}