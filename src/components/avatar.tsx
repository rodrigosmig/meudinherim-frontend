import { avatarDataUrl } from "@/helpers/avatar-helper";
import React, { type ComponentProps } from "react";
import { cn } from "@/helpers/string-helper";

export type AvatarProps = ComponentProps<"img"> & {
  name?: string;
  size?: number; // px
  bg?: string;
  color?: string;
  ring?: boolean;
};

export function Avatar({
  name = "",
  size = 40,
  bg = "#8b5cf6",
  color = "#fff",
  ring = false,
  className,
  style,
  src, // allow overriding
  alt, // allow overriding
  ...props
}: AvatarProps) {
  const px = `${size}px`;
  const finalSrc = src ?? avatarDataUrl(name, bg, color, size);
  const classes = cn(className, ring && "ring-2 ring-violet-500");
  const finalStyle: React.CSSProperties = { width: px, height: px, borderRadius: "9999px", objectFit: "cover", ...(style || {}) };

  return (
    <img
      src={finalSrc}
      alt={alt ?? name}
      className={classes}
      style={finalStyle}
      {...props}
    />
  );
}

export default Avatar;
