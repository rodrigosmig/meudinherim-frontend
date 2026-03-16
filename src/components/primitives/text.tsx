import { tv, VariantProps } from "tailwind-variants";
import React from "react";

export const textVariants = tv({
  base: "text-gray-300",
  variants: {
    variant: {
      "heading-large": "text-2xl font-bold", //24px
      "heading-medium": "text-xl font-bold", //20px
      "heading-small": "text-lg font-bold", //18px
      "label-mini": "text-xs font-regular", //12px
      "label-small": "text-sm font-regular", //14px
      "label-medium": "text-base font-regular", //16px
      "label-large": "text-lg font-regular", //18px
      "label-mini-bold": "text-xs font-bold", //12px
      "label-small-bold": "text-sm font-bold", //14px
      "label-medium-bold": "text-base font-bold", //16px
      "label-large-bold": "text-lg font-bold", //18px
    },
  },
  defaultVariants: {
    variant: "label-medium",
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