type AcceptModalProps = {
  message: string;
  onClose: () => void;
};

export default function AcceptModal({ message, onClose }: AcceptModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[320px] rounded-[20px] bg-white p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-base font-semibold text-[var(--color-primary)]">{message}</p>
        <button
          type="button"
          className="mt-4 w-full rounded-[12px] bg-[var(--color-primary)] py-3 text-sm font-semibold text-[var(--color-secondary)]"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}
