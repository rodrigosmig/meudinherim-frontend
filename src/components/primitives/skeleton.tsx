import { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const skeletonVariants = tv({
	base: "animate-shimmer overflow-hidden pointer-events-none",
	variants: {
		rounded: {
			sm: "rounded-sm",
			lg: "rounded-2xl",
			full: "rounded-full",
		},
	},
	defaultVariants: {
		rounded: "lg",
	},
});

interface SkeletonProps extends VariantProps<typeof skeletonVariants>, ComponentProps<"div"> { }

export default function Skeleton({
	rounded,
	className,
	...props
}: SkeletonProps) {
	return <div className={skeletonVariants({ rounded, className })} {...props} />;
}
