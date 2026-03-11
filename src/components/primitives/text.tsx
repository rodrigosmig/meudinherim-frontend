import { tv, VariantProps } from "tailwind-variants";
import React from "react";

export const textVariants = tv({
  base: "text-gray-300",
  variants: {
    variant: {
      "heading-large": "text-2xl font-bold",
      "heading-medium": "text-xl font-bold",
      "heading-small": "text-base font-bold",
      "paragraph-large": "text-base font-medium",
      "paragraph-medium": "text-sm font-medium",
      "paragraph-small": "text-xs font-medium",
      "label-medium": "text-base font-semibold",
      "label-small": "text-xs font-semibold",
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