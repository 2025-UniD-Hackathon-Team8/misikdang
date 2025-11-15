import type { ReactNode } from "react";

interface FoodCardProps {
  imageUrl: string;
  title: string;
  restaurant: string;
  rating: number;
  reviewCount: number;
  distance: string;
  description: string;
  children?: ReactNode;
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
}: FoodCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mx-4">
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

        {/* Action Button */}
        {children}
      </div>
    </div>
  );
}
