import type { ReactNode } from "react";

interface RequestCardSmallProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  thumbnailColor?: string;
  showRatingIcon?: boolean;
  subtitleIcon?: ReactNode;
  onClose?: () => void;
  className?: string;
}

const DefaultRatingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
    <path
      d="M6.77736 10.8458L3.49194 12.825C3.3468 12.9174 3.19507 12.9569 3.03674 12.9437C2.8784 12.9306 2.73986 12.8778 2.62111 12.7854C2.50236 12.6931 2.41 12.5777 2.34403 12.4395C2.27805 12.3012 2.26486 12.146 2.30444 11.974L3.17528 8.23333L0.265902 5.71979C0.133957 5.60104 0.0516239 5.46567 0.0189017 5.31367C-0.0138206 5.16167 -0.00405671 5.01336 0.0481933 4.86875C0.100443 4.72414 0.17961 4.60539 0.285693 4.5125C0.391777 4.41961 0.536915 4.36024 0.72111 4.33438L4.56069 3.99792L6.04507 0.475C6.11104 0.316667 6.21343 0.197917 6.35224 0.11875C6.49104 0.0395832 6.63275 0 6.77736 0C6.92197 0 7.06368 0.0395832 7.20249 0.11875C7.34129 0.197917 7.44368 0.316667 7.50965 0.475L8.99403 3.99792L12.8336 4.33438C13.0183 4.36076 13.1635 4.42014 13.269 4.5125C13.3746 4.60486 13.4537 4.72361 13.5065 4.86875C13.5593 5.01389 13.5693 5.16246 13.5366 5.31446C13.5039 5.46646 13.4213 5.60157 13.2888 5.71979L10.3794 8.23333L11.2503 11.974C11.2899 12.1455 11.2767 12.3007 11.2107 12.4395C11.1447 12.5783 11.0524 12.6936 10.9336 12.7854C10.8149 12.8772 10.6763 12.93 10.518 12.9437C10.3597 12.9575 10.2079 12.9179 10.0628 12.825L6.77736 10.8458Z"
      fill="#FFBF00"
    />
  </svg>
);

export default function RequestCardSmall({
  title = "",
  subtitle = "",
  thumbnailColor = "#e5e5e5",
  showRatingIcon = true,
  subtitleIcon,
  onClose,
  className = "",
}: RequestCardSmallProps) {
  return (
    <article
      className={`flex h-[77px] w-[345px] items-center gap-4 rounded-[10px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.06)] ${className}`}
    >
      <div className="h-[45px] w-[45px] rounded-[10px]" style={{ backgroundColor: thumbnailColor }} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <h2 className="truncate text-base font-semibold text-[var(--color-primary)]">{title}</h2>
        <p className="flex items-center gap-1 text-sm text-[var(--color-gray-1)]">
          {showRatingIcon ? subtitleIcon ?? <DefaultRatingIcon /> : null}
          <span className="truncate">{subtitle}</span>
        </p>
      </div>
      {onClose && (
        <button
          type="button"
          className="text-xl text-[#cccccc] transition hover:text-[var(--color-gray-2)]"
          onClick={onClose}
          aria-label={`${title} 카드 닫기`}
        >
          ×
        </button>
      )}
    </article>
  );
}
