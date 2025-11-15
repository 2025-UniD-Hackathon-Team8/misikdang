import type { ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";

interface FoodCardProps {
  imageUrl: string;
  title: string;
  restaurant: string;
  rating: number;
  reviewCount: number;
  distance: string;
  description: string;
  children?: ReactNode;
  onSwipeRight?: () => void;
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
  children,
  onSwipeRight,
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
    }
  };

  // 뒤에 있는 카드들의 스타일
  const isBackground = index > 0;
  const backgroundRotation = index === 1 ? -3 : index === 2 ? -4 : 0;
  const backgroundOpacity = index === 1 ? 0.5 : index === 2 ? 0.8 : 1;
  const zIndex = totalCards - index;

  if (isBackground) {
    return (
      <motion.div
        className="absolute top-0 left-0 bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{
          rotate: backgroundRotation,
          opacity: backgroundOpacity,
        }}
        animate={{
          rotate: backgroundRotation,
          opacity: backgroundOpacity,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        style={{
          zIndex,
          width: "320px",
          height: "480px",
          left: "50%",
          marginLeft: "-160px",
        }}
      >
        {/* Food Image */}
        <div className="w-full h-64 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-1">{title}</h2>

          {/* Restaurant */}
          <p className="text-sm mb-3" style={{ color: "#666666" }}>
            {restaurant}
          </p>

          {/* Rating and Distance */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold">
              {rating}({reviewCount})
            </span>
            <span style={{ color: "#aaaaaa" }}>{distance}</span>
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "#666666" }}
          >
            {description}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute top-0 left-0 bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
        zIndex,
        width: "320px",
        height: "480px",
        left: "50%",
        marginLeft: "-160px",
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
    >
      {/* Food Image */}
      <div className="w-full h-52 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h2 className="text-xl font-bold mb-1">{title}</h2>

        {/* Restaurant */}
        <p className="text-xs mb-2" style={{ color: "#666666" }}>
          {restaurant}
        </p>

        {/* Rating and Distance */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="font-semibold text-xs">
            {rating}({reviewCount})
          </span>
          <span className="text-xs" style={{ color: "#aaaaaa" }}>
            {distance}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-xs leading-relaxed mb-4"
          style={{ color: "#666666" }}
        >
          {description}
        </p>

        {/* Action Button */}
        {children}
      </div>
    </motion.div>
  );
}
