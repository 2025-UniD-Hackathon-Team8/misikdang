import { useState } from "react";
import FoodCard from "../components/FoodCard";
import Button from "../components/Button";
import { colors } from "../constants/colors";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const foodItems = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
      title: "슈퍼 햄부기",
      restaurant: "맥도날드 삼성역 8번 출구점",
      rating: 4.9,
      reviewCount: 343,
      distance: "1.7km",
      description:
        "육즙이 가득한 비프 패티와 신선한 야채, 특제 소스가 어우러진 프리미엄 햄버거입니다. 부드러운 참깨 번과 함께 즐기는 최고의 맛!",
    },
  ];

  return (
    <div
      className="w-full"
      style={{
        background:
          "linear-gradient(180deg, #FFB682 0%, #FFB682 20%, #fcfcfc 47%, #fcfcfc 100%)",
      }}
    >
      <div>
        <FoodCard {...foodItems[currentIndex]}>
          <Button
            bgColor={colors.primary}
            fgColor={colors.secondary}
            className="w-full py-4 text-lg font-bold rounded-2xl"
          >
            미식 신청 완료!
          </Button>
        </FoodCard>
      </div>
    </div>
  );
}
