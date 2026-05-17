"use client";

import { cn } from "@/helpers/string-helper";
import { Landmark } from "lucide-react";
import { useState } from "react";

interface BankIconProps {
  icon: string;
  name?: string;
  size?: number;
  className?: string;
}

export function BankIcon({ icon, name, size = 36, className }: BankIconProps) {
  const [failed, setFailed] = useState(false);

  const style = { width: size, height: size, minWidth: size };

  if (!icon || failed) {
    return (
      <span
        style={style}
        className={cn(
          "inline-flex items-center justify-center rounded-xl bg-gray-700 shrink-0",
          className,
        )}
      >
        <Landmark style={{ width: size * 0.5, height: size * 0.5 }} className="text-gray-400" />
      </span>
    );
  }

  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center justify-center rounded-xl overflow-hidden shrink-0 bg-gray-800",
        className,
      )}
    >
      <img
        src={`/icons/banks/${icon}.svg`}
        alt={name ?? icon}
        className="w-full h-full object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
