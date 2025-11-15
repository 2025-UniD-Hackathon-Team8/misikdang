import { useEffect, useState } from "react";

const LOGO_TEXT = "美食堂";
const PRONUNCIATION_TEXT = "미·식당";

type OnboardingPageProps = {
  onStartChef: () => void;
  onStartGourmet: () => void;
};

function SplashBrandMark() {
  return (
    <div className="relative inline-flex items-end justify-center">
      <span className="text-[39px] font-semibold leading-[1.1] text-[var(--color-primary)]">
        {LOGO_TEXT}
      </span>
      <span className="font-joseon absolute -bottom-4 right-2 text-base tracking-[0.08em] text-[var(--color-primary)]">
        {PRONUNCIATION_TEXT}
      </span>
    </div>
  );
}

function MainBrandMark() {
  return (
    <div className="relative inline-flex items-end justify-center">
      <span className="font-tmon text-[64px] font-black leading-none text-[#000000]">
        {LOGO_TEXT}
      </span>
      <span className="font-joseon absolute -bottom-5 right-2 text-[20px] text-[#000000]">
        {PRONUNCIATION_TEXT}
      </span>
    </div>
  );
}

export default function OnboardingPage({ onStartChef, onStartGourmet }: OnboardingPageProps) {
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowMainContent(true), 2000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleGourmetStart = () => {
    onStartGourmet();
  };

  const baseButtonClass =
    "font-inter flex h-[45px] w-[265px] items-center justify-center rounded-[10px] text-center text-[17px] font-bold leading-none";

  if (!showMainContent) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[var(--color-background)]">
        <SplashBrandMark />
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center bg-[var(--color-background)] px-6">
      <div className="pt-[215px]">
        <MainBrandMark />
      </div>

      <div className="mt-auto mb-[160px] flex flex-col items-center gap-5">
        <button
          type="button"
          className={`${baseButtonClass} border border-[#000000] text-[#000000]`}
          onClick={handleGourmetStart}
        >
          미식가로 시작하기
        </button>
        <button
          type="button"
          className={`${baseButtonClass} border border-[#000000] bg-[#000000] text-[#ffffff]`}
          onClick={onStartChef}
        >
          쉐프로 시작하기
        </button>
      </div>
    </main>
  );
}
