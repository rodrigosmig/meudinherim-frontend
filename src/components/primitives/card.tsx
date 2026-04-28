import { cn } from "@/helpers/string-helper";
import { ComponentProps } from "react";

interface CardProps extends ComponentProps<'div'> {
  children: React.ReactNode;
}

function CardRoot({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("bg-card rounded-2xl border border-default-border overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-black/30", className)} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends ComponentProps<'div'> {
  children: React.ReactNode;
}

function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 px-6 py-5 border-b border-default-border", className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends ComponentProps<'div'> {
  children: React.ReactNode;
}

function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div className={cn("border-t border-default-border px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Footer: CardFooter,
}