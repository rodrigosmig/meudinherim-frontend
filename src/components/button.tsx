import { ComponentProps, ElementType, ReactNode } from "react";
import { tv } from "tailwind-variants";

const buttonVariants = tv({
  base: [
    "flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-lg transition-colors cursor-pointer"
  ],
  variants: {
    variant: {
      primary: [
        "bg-violet-700 hover:bg-violet-600 text-white",
      ],
      secondary: [
        "bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 border border-violet-500/20",
      ],
      destructive: [
        "bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20",
      ]
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

interface ButtonProps extends ComponentProps<'button'> {
  variant?: "primary" | "secondary" | "destructive";
  icon: ElementType
  children: ReactNode;
}

export default function Button({ children, icon: Icon, variant, className, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, className })}
      {...props}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  )
}