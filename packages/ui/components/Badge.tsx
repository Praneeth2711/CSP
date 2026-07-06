import * as React from "react";
import { cn } from "../utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "info" | "warning" | "error" | "default";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors";
  
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    info: "bg-blue-50 text-blue-700 border border-blue-100",
    warning: "bg-orange-50/50 text-orange-700 border border-orange-100",
    error: "bg-red-50 text-red-700 border border-red-100",
    default: "bg-slate-100 text-slate-700 border border-slate-200"
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
