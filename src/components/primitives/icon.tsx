import { cn } from "@/helpers/string-helper";
import { tv } from "tailwind-variants";
import { ElementType } from "react";

const iconVariants = tv({
  base: [
    "w-4 h-4 md:w-5 md:h-5 text-gray-400"
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