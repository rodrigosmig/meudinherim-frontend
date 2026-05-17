import { cn } from "@/helpers/string-helper";
import { ElementType } from "react";
import { tv } from "tailwind-variants";

const iconVariants = tv({
  base: [
    "w-4 h-4"
  ],
  variants: {
    loading: {
      true: "animate-spin",
      false: ""
    }
  },
  defaultVariants: {
    loading: false
  }
});

type IconProps = {
  icon: ElementType;
  loading?: boolean;
  className?: string;
}

export default function Icon({ icon: IconComponent, loading = false, className }: IconProps) {
  return (
    <IconComponent className={cn(iconVariants({ loading }), className)} />
  )
}