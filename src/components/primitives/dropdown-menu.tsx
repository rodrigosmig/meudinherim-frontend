import { cn } from "@/helpers/string-helper";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";

interface DropdownProps {
  className?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

function DropdownRoot({ className, children, open, onOpenChange, modal }: DropdownProps) {
  return (
    <div className={cn("relative", className)}>
      <DropdownPrimitive.Root open={open} onOpenChange={onOpenChange} modal={modal}>
        {children}
      </DropdownPrimitive.Root>
    </div>
  )
}

interface DropdownTriggerProps {
  children: React.ReactNode;
}

function DropdownTrigger({ children }: DropdownTriggerProps) {
  return <DropdownPrimitive.Trigger asChild>
    {children}
  </DropdownPrimitive.Trigger>
}

interface DropdownContentProps {
  className?: string;
  align?: "start" | "center" | "end";
  children: React.ReactNode;
}

function DropdownContent({ className, align = "center", children }: DropdownContentProps) {
  return <DropdownPrimitive.Portal>
    <DropdownPrimitive.Content
      side="bottom"
      align={align}
      sideOffset={2}
      className={cn("rounded-lg border border-border-muted bg-surface-raised shadow-xl shadow-black/40 z-50 p-2",
        className,
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95",
        "data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "duration-200")}
    >
      {children}
      <DropdownPrimitive.Arrow className="fill-surface-raised" />
    </DropdownPrimitive.Content>
  </DropdownPrimitive.Portal>
}

interface DropdownItemProps {
  children: React.ReactNode;
  className?: string;
}

function DropdownItem({ children, className }: DropdownItemProps) {
  return (
    <DropdownPrimitive.Item
      asChild
      className={cn("focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0", className)}
    >
      {children}
    </DropdownPrimitive.Item>
  )

}

export const DropdownMenu = {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
}