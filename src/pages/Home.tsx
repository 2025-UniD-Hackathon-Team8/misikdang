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
    {
      imageUrl:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
      title: "크리스피 치킨버거",
      restaurant: "KFC 강남점",
      rating: 4.7,
      reviewCount: 289,
      distance: "2.1km",
      description:
        "바삭한 프라이드 치킨과 신선한 양상추, 마요네즈 소스가 조화를 이루는 치킨버거입니다.",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800",
      title: "더블 치즈버거",
      restaurant: "버거킹 역삼점",
      rating: 4.8,
      reviewCount: 412,
      distance: "1.2km",
      description:
        "두 장의 비프 패티와 진한 체다 치즈가 듬뿍 들어간 프리미엄 더블 치즈버거입니다.",
    },
  ];

  const handleSwipeRight = () => {
    if (currentIndex < foodItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div
      className="w-full min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #FFB682 0%, #FFB682 20%, #fcfcfc 47%, #fcfcfc 100%)",
      }}
    >
      {/* Logo */}
      <div className="py-10 flex justify-center items-end">
        <div className="relative">
          <span className="text-3xl font-bold" style={{ color: "#000000" }}>
            美食堂
          </span>
          <span
            className="absolute text-[10px] font-bold"
            style={{
              bottom: "-12px",
              right: "0px",
            }}
          >
            미·식당
          </span>
        </div>
      </div>

      <div className="relative" style={{ height: "520px" }}>
        {/* 배경 카드들 (뒤에서부터) */}
        {[2, 1].map((offset) => {
          const index = currentIndex + offset;
          if (index < foodItems.length) {
            return (
              <FoodCard
                key={`bg-${index}`}
                {...foodItems[index]}
                index={offset}
                totalCards={3}
              />
            );
          }
          return null;
        })}

        {/* 현재 카드 */}
        {currentIndex < foodItems.length && (
          <FoodCard
            key={`current-${currentIndex}`}
            {...foodItems[currentIndex]}
            onSwipeRight={handleSwipeRight}
            index={0}
            totalCards={3}
          >
            <Button
              bgColor={colors.primary}
              fgColor={colors.secondary}
              className="w-full py-2 text-base font-bold rounded-2xl"
            >
              미식 신청 완료!
            </Button>
          </FoodCard>
        )}
      </div>
    </div>
  );
}
