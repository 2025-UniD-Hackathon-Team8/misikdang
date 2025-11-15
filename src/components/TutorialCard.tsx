import { motion, useMotionValue, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { useState } from "react";
import tutorialImage from "../assets/tutorial.png";
import { colors } from "../constants";

interface TutorialCardProps {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
}

export default function TutorialCard({ onSwipeRight, onSwipeLeft }: TutorialCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false);
    if (info.offset.x > 100) {
      onSwipeRight?.();
    } else if (info.offset.x < -100) {
      onSwipeLeft?.();
    }
  };

  return (
    <motion.div
      className="absolute top-0 left-0 bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      initial={{
        rotate: 0,
        opacity: 1,
      }}
      animate={{
        rotate: !isDragging ? [0, -1.5, 1.5, -1.5, 1.5, 0] : 0,
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        repeat: isDragging ? 0 : Infinity,
        repeatDelay: 4,
        delay: 2,
      }}
      style={{
        x,
        rotate,
        opacity,
        zIndex: 3,
        width: "320px",
        height: "600px",
        left: "50%",
        marginLeft: "-160px",
        originY: 1,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
    >
      {/* Tutorial Image with Overlays */}
      <div className="relative w-full h-full">
        {/* Background Image */}
        <img src={tutorialImage} alt="Tutorial" className="w-full h-full object-contain" style={{ pointerEvents: "none" }} />

        <div className="absolute top-24 left-1/2 -translate-x-1/2">
          <p
            className="text-[28px] font-bold"
            style={{
              color: colors.primary,
            }}
          >
            넘겨서 시작
          </p>
        </div>

        {/* Left Text - 별로예요 */}
        <div className="absolute left-5 top-39/64 -translate-y-1/2">
          <span
            className="text-2xl font-bold"
            style={{
              color: colors.primary,
            }}
          >
            별로예요
          </span>
        </div>

        {/* Right Text - 좋아요 */}
        <div className="absolute right-5 top-39/64 -translate-y-1/2">
          <span
            className="text-2xl font-bold"
            style={{
              color: colors.primary,
            }}
          >
            좋아요
          </span>
        </div>
      </div>
    </motion.div>
  );
}
