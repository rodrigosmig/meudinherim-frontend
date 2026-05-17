import { ComponentProps } from "react";
import { tv, VariantProps } from "tailwind-variants";

const headingVariants = tv({
  base: [
    "text-default-text",
  ],
  variants: {
    variant: {
      heading1: [
        "text-4xl font-bold",
      ],
      heading2: [
        "text-3xl font-bold",
      ],
      heading3: [
        "text-2xl font-semibold",
      ],
      heading4: [
        "text-xl font-semibold",
      ],
    }
  },
  defaultVariants: {
    variant: 'heading1',
  },
});

interface HeadingProps extends ComponentProps<"h1">, VariantProps<typeof headingVariants> {
  className?: string;
  children: React.ReactNode;
}

export default function Heading({
  variant,
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <h1 className={headingVariants({ variant, className })} {...props}>
      {children}
    </h1>
  );
}