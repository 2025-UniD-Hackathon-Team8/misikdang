import type { ReactNode } from "react";
import backButtonIcon from './assets/Vector.svg';

export default function backButton({
  children,
  bgColor = colors.primary,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button>
      <backButtonIcon className="h-6 w-6"/>
    </button>
  );
};
