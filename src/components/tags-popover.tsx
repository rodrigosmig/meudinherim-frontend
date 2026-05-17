"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Tags } from "lucide-react";

import { cn } from "@/helpers/string-helper";

type TagsPopoverProps = {
  tags: string[];
  className?: string;
};

export default function TagsPopover({ tags, className }: Readonly<TagsPopoverProps>) {
  if (!tags || tags.length === 0) return null;

  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <button
            type="button"
            aria-label={`${tags.length} tag${tags.length > 1 ? "s" : ""}`}
            className={cn(
              "group inline-flex items-center justify-center rounded p-0.5 cursor-default",
              className,
            )}
          >
            <Tags className="w-4 h-4 text-gray-500 transition-colors duration-150 group-hover:text-primary" />
          </button>
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            sideOffset={6}
            className="z-50 max-w-48 rounded-lg border border-gray-700 bg-gray-800 p-2 shadow-lg shadow-black/30
              data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95
              data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          >
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-default-text"
                >
                  {tag}
                </span>
              ))}
            </div>
            <TooltipPrimitive.Arrow className="fill-gray-700" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
