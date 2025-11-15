import type { ReactNode } from "react";
import { color, motion, useMotionValue, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { colors } from "../constants";

interface Restaurant {
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  thumbnail: string;
}

interface CategoryCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  restaurants: Restaurant[];
  children?: ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  index?: number;
  totalCards?: number;
}

export default function CategoryCard({
  imageUrl,
  title,
  subtitle,
  restaurants,
  children,
  onSwipeRight,
  onSwipeLeft,
  index = 0,
  totalCards = 1,
}: CategoryCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipeRight?.();
    } else if (info.offset.x < -100) {
      onSwipeLeft?.();
    }
  };

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
      {/* Category Image */}
      <div className="w-full h-70 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        {/* Title */}
        <h2 className="text-xl font-bold mb-1">{title}</h2>

        {/* Subtitle */}
        <p className="text-sm mb-2" style={{ color: "#666666" }}>
          {subtitle}
        </p>

        <hr className={`border-t pt-1"}`} style={{ color: colors.gray1 }} />

        {/* Restaurant Count */}
        <p className={`text-sm mb-3"}`} style={{ color: colors.gray2 }}>
          근처에 <span className="font-bold">{restaurants.length}</span>개의
          식당이 있어요
        </p>

        {/* Restaurant List */}
        <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
          {restaurants.map((restaurant, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <img
                src={restaurant.thumbnail}
                alt={restaurant.name}
                className="w-12 h-12 rounded-lg object-cover"
                loading="eager"
              />
              <div className="flex-1">
                <p className="text-xs font-medium mb-1">{restaurant.name}</p>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold">
                    {restaurant.rating}({restaurant.reviewCount})
                  </span>
                  <span style={{ color: colors.gray2 }}>
                    {restaurant.distance}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {children}
      </div>
    </motion.div>
  );
}
