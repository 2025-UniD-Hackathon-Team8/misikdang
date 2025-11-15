import { useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { colors } from "../constants/colors";

interface ApplyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  bgColor?: string;
  fgColor?: string;
  className?: string;
  discount?: number;
  isApplied?: boolean;
  onApply?: () => void;
}

export default function ApplyButton({
  children,
  bgColor,
  fgColor,
  className = "",
  discount,
  isApplied = false,
  onApply,
  ...props
}: ApplyButtonProps) {
  const [applied, setApplied] = useState(isApplied);

  const handleClick = () => {
    if (!applied) {
      setApplied(true);
      onApply?.();
    }
  };

  const buttonBg = applied ? bgColor || colors.primary : colors.secondary;
  const buttonFg = applied ? fgColor || colors.secondary : colors.primary;
  const buttonBorder = applied ? "none" : `2px solid ${colors.primary}`;

  const getDiscountText = () => {
    if (!discount) return null;
    if (discount === 100) return "무료로 신청 가능!";
    return `${discount}% 할인 가능!`;
  };

  return (
    <div className="w-full">
      <button
        className={`rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        style={{
          backgroundColor: buttonBg,
          color: buttonFg,
          border: buttonBorder,
        }}
        onClick={handleClick}
        {...props}
      >
        {applied ? "신청 완료" : children}
      </button>
      {!applied && discount && (
        <p className="text-center text-xs mt-2 font-semibold">
          {getDiscountText()}
        </p>
      )}
    </div>
  );
}
