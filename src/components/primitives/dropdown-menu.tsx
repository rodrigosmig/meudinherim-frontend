import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/helpers/string-helper";

interface DropdownProps {
  children: React.ReactNode;
}

export function DropdownRoot({ children }: DropdownProps) {
  return (
    <div className="relative">
      <DropdownPrimitive.Root>
        {children}
      </DropdownPrimitive.Root>
    </div>
  )
}

interface DropdownTriggerProps {
  children: React.ReactNode;
}

export function DropdownTrigger({ children }: DropdownTriggerProps) {
  return <DropdownPrimitive.Trigger asChild>
    {children}
  </DropdownPrimitive.Trigger>
}

interface DropdownContentProps {
  className?: string;
  align?: "start" | "center" | "end";
  children: React.ReactNode;
}

export function DropdownContent({ className, align = "center", children }: DropdownContentProps) {
  return <DropdownPrimitive.Portal>
    <DropdownPrimitive.Content
      side="bottom"
      align={align}
      sideOffset={2}
      className={cn("rounded-lg border border-gray-800 bg-gray-700 shadow-lg z-50 p-2",
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
      <DropdownPrimitive.Arrow className="fill-gray-700" />
    </DropdownPrimitive.Content>
  </DropdownPrimitive.Portal>
}

interface DropdownItemProps {
  children: React.ReactNode;
}

export function DropdownItem({ children }: DropdownItemProps) {
  return (
    <DropdownPrimitive.Item
      asChild
      className="focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
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