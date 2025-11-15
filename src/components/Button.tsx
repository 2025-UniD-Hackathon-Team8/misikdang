import type { ButtonHTMLAttributes, ReactNode } from "react";
import { colors } from "../constants/colors";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  bgColor?: string;
  fgColor?: string;
  className?: string;
}

export default function Button({
  children,
  bgColor = colors.primary,
  fgColor = colors.secondary,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-medium rounded-lg px-8 py-2  ${className}`}
      style={{ backgroundColor: bgColor, color: fgColor }}
      {...props}
    >
      {children}
    </button>
  );
}
