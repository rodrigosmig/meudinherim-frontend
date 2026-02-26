import { ComponentProps, ElementType, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { tv } from "tailwind-variants";
import { cn } from "@/helpers/utils";

import Tooltip from "./tooltip";

const buttonVariants = tv({
  base: [
    "flex items-center justify-center gap-2 px-2 py-2 text-xs md:text-sm font-bold hover:text-white transition-colors rounded-md"
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
      icon: [
        "p-2 hover:bg-gray-800 rounded-lg transition-colors relative",
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

interface ButtonProps extends ComponentProps<'button'> {
  variant?: "primary" | "edit" | "remove" | "info" | "cancel" | "pagination" | "icon";
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
        {Icon && <Icon className={cn("w-4 h-4 md:w-5 md:h-5", iconClassName)} />}
        {isLoading
          ? <LoaderCircle className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
          : children && <span>{children}</span>
        }

      </button>
    </Tooltip>
  )
}