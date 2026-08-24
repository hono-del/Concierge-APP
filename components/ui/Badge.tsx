import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { IconGlyph, type IconName } from "./IconGlyph";

type BadgeVariant = "success" | "attention" | "danger" | "neutral" | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: IconName;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-success",
  attention: "bg-amber-50 text-attention",
  danger: "bg-red-50 text-danger",
  neutral: "bg-slate-100 text-secondary",
  info: "bg-blue-50 text-accent",
};

export function Badge({ className, variant = "neutral", icon, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon ? <IconGlyph name={icon} size={14} /> : null}
      {children}
    </span>
  );
}
