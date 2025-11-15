import type { ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { colors } from "../constants/colors";

interface FoodCardProps {
  imageUrl: string;
  title: string;
  restaurant: string;
  rating: number;
  reviewCount: number;
  distance: string;
  description: string;
  discount?: number;
  children?: ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  index?: number;
  totalCards?: number;
}

export default function FoodCard({
  imageUrl,
  title,
  restaurant,
  rating,
  reviewCount,
  distance,
  description,
  discount,
  children,
  onSwipeRight,
  onSwipeLeft,
  index = 0,
  totalCards = 1,
}: FoodCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      // 오른쪽으로 스와이프
      onSwipeRight?.();
    } else if (info.offset.x < -100) {
      // 왼쪽으로 스와이프
      onSwipeLeft?.();
    }
  };

  // 뒤에 있는 카드들의 스타일
  const isBackground = index > 0;
  const backgroundRotation = index === 1 ? -3 : index === 2 ? -4 : 0;
  const zIndex = totalCards - index;

  return (
    <motion.div
      className={`absolute top-0 left-0 bg-white rounded-3xl shadow-2xl overflow-hidden ${
        !isBackground ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      initial={{
        rotate: isBackground ? backgroundRotation : 0,
        opacity: 1,
      }}
      animate={{
        rotate: isBackground ? backgroundRotation : 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      style={{
        x: !isBackground ? x : 0,
        rotate: !isBackground ? rotate : undefined,
        opacity: !isBackground ? opacity : 1,
        zIndex,
        width: "320px",
        height: "600px",
        left: "50%",
        marginLeft: "-160px",
      }}
      drag={!isBackground ? "x" : false}
      dragConstraints={!isBackground ? { left: 0, right: 0 } : undefined}
      dragElastic={!isBackground ? 0.7 : undefined}
      onDragEnd={!isBackground ? handleDragEnd : undefined}
      whileTap={!isBackground ? { cursor: "grabbing" } : undefined}
    >
      {/* Food Image */}
      <div className="w-full h-80 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col h-[calc(100%-320px)] p-4">
        <div className="flex-1">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-1">{title}</h2>

          {/* Restaurant */}
          <p className="text-sm mb-2" style={{ color: colors.gray1 }}>
            {restaurant}
          </p>

          {/* Rating and Distance */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-500 text-base">★</span>
            <span className="font-semibold text-base">
              {rating}({reviewCount})
            </span>
            <span className="text-base" style={{ color: colors.gray2 }}>
              {distance}
            </span>
          </div>

          {/* Description */}
          <p
            className="text-xs leading-relaxed line-clamp-4"
            style={{ color: colors.gray1 }}
          >
            {description}
          </p>
        </div>

        {/* Action Button */}
        <div>{children}</div>
      </div>
    </motion.div>
  );
}
