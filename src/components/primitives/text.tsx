import React from "react";
import { tv, VariantProps } from "tailwind-variants";

export const textVariants = tv({
  base: "text-white",
  variants: {
    variant: {
      "heading-large": "text-2xl leading-[130%] font-bold",
      "heading-medium": "text-xl leading-[130%] font-bold",
      "heading-small": "text-base leading-[130%] font-bold",
      "paragraph-large": "text-base leading-[150%] font-medium",
      "paragraph-medium": "text-sm leading-[150%] font-medium",
      "paragraph-small": "text-xs leading-[150%] font-medium",
      "label-medium": "text-base leading-[150%] font-semibold",
      "label-small": "text-xs leading-[150%] font-semibold",
    },
  },
  defaultVariants: {
    variant: "paragraph-medium",
  },
});

interface TextProps extends VariantProps<typeof textVariants> {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children?: React.ReactNode;
}

export default function Text({
  as = "span",
  variant,
  className,
  children,
  ...props
}: TextProps) {
  return React.createElement(
    as,
    {
      className: textVariants({ variant, className }),
      ...props,
    },
    children
  );
}