import { useState, useEffect, useMemo } from "react";
import FoodCard from "../components/FoodCard";
import CategoryCard from "../components/CategoryCard";
import ApplyButton from "../components/ApplyButton";
import EndCard from "../components/EndCard";
import { colors } from "../constants/colors";
import { foodCategories, foodItems } from "../data/mockData";
import { useImageColor } from "../hooks/useImageColor";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgColor, setBgColor] = useState("#FFB682");
  const [logoColor, setLogoColor] = useState<string>(colors.primary);

  const allCards = useMemo(() => {
    const cards = [...foodCategories, ...foodItems];
    // Fisher-Yates 셔플 알고리즘
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }, []);
  const currentCard = allCards[currentIndex];
  const { color, textColor } = useImageColor(currentCard?.imageUrl || "");

  useEffect(() => {
    if (color) {
      setBgColor(color);
    }
    if (textColor) {
      setLogoColor(textColor);
    }
  }, [color, textColor]);

  const handleSwipeRight = () => {
    if (currentIndex < allCards.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeLeft = () => {
    if (currentIndex < allCards.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div
      className="w-full min-h-screen transition-all duration-700 ease-in-out"
      style={{
        background: `linear-gradient(180deg, ${bgColor} 0%, ${bgColor} 20%, #fcfcfc 47%, #fcfcfc 100%)`,
      }}
    >
      {/* Logo */}
      <div className="py-10 flex justify-center items-end">
        <div className="relative">
          <span
            className="text-3xl font-bold transition-colors duration-700 ease-in-out"
            style={{ color: logoColor }}
          >
            美食堂
          </span>
          <span
            className="absolute text-[10px] font-bold transition-colors duration-700 ease-in-out"
            style={{
              bottom: "-12px",
              right: "0px",
              color: logoColor,
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
          if (index < allCards.length) {
            const card = allCards[index];
            if (card.type === "category") {
              return (
                <CategoryCard
                  key={`bg-${index}`}
                  {...card}
                  index={offset}
                  totalCards={3}
                />
              );
            } else {
              return (
                <FoodCard
                  key={`bg-${index}`}
                  {...card}
                  index={offset}
                  totalCards={3}
                >
                  <ApplyButton
                    bgColor={colors.primary}
                    fgColor={colors.secondary}
                    className="w-full py-2 text-base font-bold rounded-2xl"
                    discount={card.discount}
                  >
                    미식 신청하기
                  </ApplyButton>
                </FoodCard>
              );
            }
          }
          return null;
        })}

        {/* 현재 카드 */}
        {currentIndex < allCards.length ? (
          (() => {
            const currentCard = allCards[currentIndex];
            if (currentCard.type === "category") {
              return (
                <CategoryCard
                  key={`current-${currentIndex}`}
                  {...currentCard}
                  onSwipeRight={handleSwipeRight}
                  onSwipeLeft={handleSwipeLeft}
                  index={0}
                  totalCards={3}
                />
              );
            } else {
              return (
                <FoodCard
                  key={`current-${currentIndex}`}
                  {...currentCard}
                  onSwipeRight={handleSwipeRight}
                  onSwipeLeft={handleSwipeLeft}
                  index={0}
                  totalCards={3}
                >
                  <ApplyButton
                    bgColor={colors.primary}
                    fgColor={colors.secondary}
                    className="w-full py-2 text-base font-bold rounded-2xl"
                    discount={currentCard.discount}
                  >
                    미식 신청하기
                  </ApplyButton>
                </FoodCard>
              );
            }
          })()
        ) : (
          /* 마지막 카드 */
          <EndCard onReset={() => setCurrentIndex(0)} />
        )}
      </div>
    </div>
  );
}
