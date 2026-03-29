import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  const variantClass = variant === "primary" ? "button-primary" : "button-ghost";

  return (
    <button type="button" className={`button ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
