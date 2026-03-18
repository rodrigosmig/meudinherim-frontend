import React from "react";
import { tv, VariantProps } from "tailwind-variants";

export const textVariants = tv({
  base: "text-gray-300",
  variants: {
    variant: {
      "paragraph-large": "text-lg font-regular", //18px
      "paragraph-medium": "text-base font-regular", //16px
      "paragraph-small": "text-sm font-regular", //14px
      "caption": "text-xs font-regular", //12px
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