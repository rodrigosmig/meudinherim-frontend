"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

type TooltipProps = {
  children: React.ReactNode;
  label?: string;
}

export default function Tooltip({ children, label }: TooltipProps) {
  if (!label) {
    return children;
  }

  return (
    <TooltipPrimitive.Provider delayDuration={400}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild >
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="select-none rounded bg-zinc-800 px-2 py-2 text-xs leading-none text-zinc-200"
            sideOffset={5}
          >
            {label}
            <TooltipPrimitive.Arrow className="fill-white" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}