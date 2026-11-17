import type { ReactNode } from "react";

type FormStatusPanelProps = {
  variant: "success" | "error";
  children: ReactNode;
  className?: string;
};

export function FormStatusPanel({
  variant,
  children,
  className = "",
}: FormStatusPanelProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`transition-motion animate-in fade-in slide-in-from-bottom-2 duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
