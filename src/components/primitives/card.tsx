import { cn } from "@/helpers/string-helper";
import { ComponentProps } from "react";

interface CardProps extends ComponentProps<'div'> {
  children: React.ReactNode;
}

function CardRoot({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("bg-card rounded-2xl border border-gray-800 overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends ComponentProps<'div'> {
  children: React.ReactNode;
}

function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 px-6 py-5 border-b border-gray-800", className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends ComponentProps<'div'> {
  children: React.ReactNode;
}

function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div className={cn("border-t border-gray-800 px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Footer: CardFooter,
}