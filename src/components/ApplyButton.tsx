import { useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

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

  const buttonBg = applied ? bgColor || "#000000" : "#ffffff";
  const buttonFg = applied ? fgColor || "#ffffff" : "#000000";
  const buttonBorder = applied ? "none" : "2px solid #000000";

  const getDiscountText = () => {
    if (!discount) return null;
    if (discount === 100) return "무료로 신청 가능!";
    return `${discount}% 할인 가능!`;
  };

  return (
    <div className="w-full">
      <button
        className={`font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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
        <p
          className="text-center text-xs mt-2 font-semibold"
          style={{ color: "#FF6B6B" }}
        >
          {getDiscountText()}
        </p>
      )}
    </div>
  );
}
