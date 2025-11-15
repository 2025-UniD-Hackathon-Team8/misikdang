import { useState, useEffect, useMemo } from "react";
import FoodCard from "../components/FoodCard";
import CategoryCard from "../components/CategoryCard";
import TutorialCard from "../components/TutorialCard";
import ApplyButton from "../components/ApplyButton";
import EndCard from "../components/EndCard";
import { colors } from "../constants/colors";
import { foodCategories, foodItems } from "../data/mockData";
import { useImageColor } from "../hooks/useImageColor";
import {
  addCategoryCandidate,
  getGourmetProfile,
  incrementMenuCount,
  sendGourmetRequest,
} from "../utils/localStorage";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(-1); // -1로 시작하여 튜토리얼 카드 표시
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
      const currentCard = allCards[currentIndex];

      // 카테고리 카드를 오른쪽으로 스와이프하면 해당 카테고리 owner의 테스트 후보에 등록
      if (currentCard && currentCard.type === "category") {
        // 카테고리 제목에서 한글 부분만 추출 (예: "햄부기 Hamburgers" -> "햄부기")
        const categoryName = currentCard.title.split(" ")[0];

        // 현재 사용자 정보 가져오기
        const userProfile = getGourmetProfile();
        if (userProfile) {
          // 테스트 후보에 추가
          addCategoryCandidate(categoryName, {
            nickname: userProfile.nickname,
            temperature: userProfile.reviewTemperature,
          });

          // owner 메뉴의 count 증가
          incrementMenuCount(categoryName);
        }
      }

      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeLeft = () => {
    if (currentIndex < allCards.length) {
      // 왼쪽 스와이프는 그냥 다음 카드로 넘어감
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleApply = () => {
    const currentCard = allCards[currentIndex];
    if (currentCard && currentCard.type === "item") {
      const userProfile = getGourmetProfile();
      if (userProfile) {
        sendGourmetRequest(currentCard.title, {
          name: userProfile.nickname,
          temperature: userProfile.reviewTemperature,
        });
      }
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
      <div className="pt-20 pb-10 flex justify-center items-end">
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
        {/* 튜토리얼 카드 */}
        {currentIndex === -1 ? (
          <TutorialCard
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
          />
        ) : (
          <>
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
                        onApply={handleApply}
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
                        onApply={handleApply}
                      >
                        미식 신청하기
                      </ApplyButton>
                    </FoodCard>
                  );
                }
              })()
            ) : (
              /* 마지막 카드 */
              <EndCard onReset={() => setCurrentIndex(-1)} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
