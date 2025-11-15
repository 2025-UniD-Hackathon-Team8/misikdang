import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      <span className="font-joseon absolute -bottom-5 right-0 text-base tracking-[0.08em] text-[var(--color-primary)]">
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
      <span className="font-joseon absolute -bottom-8 right-1 text-[20px] text-[#000000]">
        {PRONUNCIATION_TEXT}
      </span>
    </div>
  );
}

export default function OnboardingPage({
  onStartChef,
  onStartGourmet,
}: OnboardingPageProps) {
  const [showMainContent, setShowMainContent] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowMainContent(true), 250);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleGourmetStart = () => {
    setIsExiting(true);
    setTimeout(() => {
      onStartGourmet();
    }, 300);
  };

  const handleChefStart = () => {
    setIsExiting(true);
    setTimeout(() => {
      onStartChef();
    }, 300);
  };

  const baseButtonClass =
    "font-inter flex h-[45px] w-[265px] items-center justify-center rounded-[10px] text-center text-[17px] font-bold leading-none";

  return (
    <>
      <AnimatePresence>
        {!showMainContent && (
          <motion.main
            key="splash"
            className="flex min-h-dvh items-center justify-center bg-[var(--color-background)]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <SplashBrandMark />
          </motion.main>
        )}
      </AnimatePresence>

      {showMainContent && (
        <motion.main
          className="flex min-h-dvh flex-col items-center bg-[var(--color-background)] px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        >
          <div className="pt-[215px]">
            <MainBrandMark />
          </div>

          <motion.div
            className="mt-auto mb-[160px] flex flex-col items-center gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? 20 : 0 }}
            transition={{ duration: 0.3, delay: isExiting ? 0 : 0.3 }}
          >
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
              onClick={handleChefStart}
            >
              쉐프로 시작하기
            </button>
          </motion.div>
        </motion.main>
      )}
    </>
  );
}
