import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-1.5 font-semibold rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-jmv-blue/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none whitespace-nowrap";

  const variantStyles: Record<string, string> = {
    primary:
      "bg-jmv-blue text-white hover:bg-jmv-blue-dark active:bg-jmv-blue-dark/90 shadow-sm",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 border border-slate-200",
    outline:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200",
  };

  const sizeStyles: Record<string, string> = {
    xs: "h-7 px-2.5 text-xs",
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-3.5 text-sm",
    lg: "h-10 px-5 text-sm",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : icon ? (
        <span className="inline-flex shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
