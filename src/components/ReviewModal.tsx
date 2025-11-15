import React, { useState } from "react";
import type { ReactNode } from "react";

// Props의 타입 정의
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewData: {
    restaurantName: string;
    visitDate: string;
    reviewContent?: string;
  };
  // 'pending': 작성/수정, 'history': 조회
  modalType: "pending" | "history";
  // ⭐️ 추가: 별점 표시 여부를 외부에서 제어하기 위한 Props
  showRating: boolean;
}

// 임시 필드 컴포넌트
const ReviewField: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-4 border-b border-gray-200">
    <h4 className="text-base font-bold text-gray-800 mb-2">{title}</h4>
    {children}
  </div>
);

// 임시 별점 컴포넌트
const StarRating: React.FC<{ rating: number; onRate?: (rating: number) => void; isEditable: boolean }> = ({ rating, onRate, isEditable }) => {
  const stars = [1, 2, 3, 4, 5].map((starValue) => (
    <span
      key={starValue}
      className={`text-3xl cursor-pointer transition-colors ${starValue <= rating ? "text-yellow-400" : "text-gray-300"}`}
      onClick={() => isEditable && onRate && onRate(starValue)}
    >
      ★
    </span>
  ));

  return <div className="flex justify-center space-x-1 mt-4">{stars}</div>;
};

// ⭐️ showRating Props를 추가로 받도록 함수 시그니처 수정
const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, reviewData, modalType, showRating }) => {
  if (!isOpen) return null; // 모달이 닫혀있으면 아무것도 렌더링하지 않음

  // 폼 관련 상태 (리뷰 작성/수정 모드에 사용)
  const [favoritePoint, setFavoritePoint] = useState("");
  const [disappointPoint, setDisappointPoint] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [currentRating, setCurrentRating] = useState(0); // 별점 상태

  // ⭐️ 맥도날드 리뷰를 위한 세 가지 샘플 텍스트 정의
  const sampleFavoriteText =
    "맥도날드는 역시 '빅맥'입니다. 언제 먹어도 변치 않는 클래식한 맛과 푸짐한 구성이 만족스러웠습니다. 특히 패티가 따뜻했고, 소스와 채소의 비율이 완벽하게 조화로웠습니다. 빠르고 일관된 퀄리티가 맥도날드의 최대 장점이라고 생각합니다.";

  const sampleDisappointText =
    "방문했던 시간대가 피크였는지, 감자튀김의 온도가 다소 미지근했습니다. 갓 튀긴 뜨거운 감자튀김을 기대했는데 아쉬웠어요. 그리고 드라이브 스루 주문 시 직원분의 응대가 조금 더 친절했으면 좋겠습니다.";

  const sampleRecommendText =
    "가성비를 중요하게 생각하거나 간단하게 한 끼를 해결하고 싶을 때 강력 추천합니다. 특히 런치 시간에는 다른 선택지가 없을 만큼 만족스럽습니다. 하지만 쾌적한 식사 환경을 기대한다면 피크 시간대는 피하는 것을 추천합니다.";

  const isPending = modalType === "pending"; // 리뷰 작성 모드인지
  const isHistory = modalType === "history"; // 리뷰 조회 모드인지

  // 액션 버튼 핸들러
  const handlePrimaryAction = () => {
    if (isPending) {
      // 저장하기 로직 (예: API 호출)
      console.log("리뷰 저장:", { favoritePoint, disappointPoint, recommendation });
    } else if (isHistory) {
      // 확인/평가 완료 로직
      console.log("리뷰 확인 완료 / 별점 전송:", currentRating);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
      {/* 모달 내용 컨테이너 */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90dvh] overflow-y-auto transform transition-all duration-300">
        {/* 모달 헤더 (식당 정보) */}
        <div className="p-6 pb-2 border-b border-gray-100 sticky top-0 bg-white z-[1] relative ">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-2 z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-xl font-bold text-gray-900 pr-8">{reviewData.restaurantName}</h3>
          <p className="text-sm text-gray-500 mt-1">{reviewData.visitDate}</p>
        </div>

        {/* 모달 본문 (스크롤 영역) */}
        <div className="p-6 pt-0">
          {/* 1. 가장 마음에 들었던 점 */}
          <ReviewField title="이 메뉴에서 가장 마음에 들었던 점">
            {isPending ? (
              <textarea
                className="w-full border-gray-300 rounded-md p-2 text-sm focus:ring-orange-500 focus:border-orange-500"
                rows={4}
                value={favoritePoint}
                onChange={(e) => setFavoritePoint(e.target.value)}
                placeholder="내용을 입력해주세요..."
              />
            ) : (
              // ⭐️ 수정 적용: 가장 마음에 들었던 점 (1번 텍스트)
              <p className="text-sm text-gray-700 whitespace-pre-line">{reviewData.reviewContent || sampleFavoriteText}</p>
            )}
          </ReviewField>

          {/* 2. 아쉬웠던 점 */}
          <ReviewField title="아쉬웠던 점이 있었다면 무엇인가요">
            {isPending ? (
              <textarea
                className="w-full border-gray-300 rounded-md p-2 text-sm focus:ring-orange-500 focus:border-orange-500"
                rows={4}
                value={disappointPoint}
                onChange={(e) => setDisappointPoint(e.target.value)}
                placeholder="내용을 입력해주세요..."
              />
            ) : (
              // ⭐️ 수정 적용: 아쉬웠던 점 (2번 텍스트)
              <p className="text-sm text-gray-700 whitespace-pre-line">{reviewData.reviewContent || sampleDisappointText}</p>
            )}
          </ReviewField>

          {/* 3. 추천 여부 */}
          <ReviewField title="이 메뉴를 다른 사람에게 추천하고 싶나요?">
            {isPending ? (
              <textarea
                className="w-full border-gray-300 rounded-md p-2 text-sm focus:ring-orange-500 focus:border-orange-500"
                rows={4}
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="내용을 입력해주세요..."
              />
            ) : (
              // ⭐️ 수정 적용: 추천 여부 (3번 텍스트)
              <p className="text-sm text-gray-700 whitespace-pre-line">{reviewData.reviewContent || sampleRecommendText}</p>
            )}
          </ReviewField>

          {/* ⭐️ 수정: isHistory와 showRating이 모두 true일 때만 별점을 표시 */}
          {isHistory && showRating && (
            <div className="mt-4 pb-4">
              <StarRating rating={currentRating} onRate={setCurrentRating} isEditable={true} />
            </div>
          )}
        </div>

        {/* 하단 액션 버튼 */}
        <div className="p-4 pt-0 sticky bottom-0 bg-white border-t border-gray-100 z-[1]">
          {isPending ? (
            // 리뷰 작성 모드 버튼
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-300 py-3 rounded-md text-base font-semibold text-gray-900 hover:bg-gray-50 transition duration-150"
              >
                취소
              </button>
              <button
                onClick={handlePrimaryAction}
                className="flex-1 bg-gray-900 py-3 rounded-md text-base font-semibold text-white hover:bg-gray-800 transition duration-150"
              >
                저장하기
              </button>
            </div>
          ) : (
            <button
              onClick={handlePrimaryAction}
              className="w-full bg-gray-900 py-3 rounded-md text-base font-semibold text-white hover:bg-gray-800 transition duration-150"
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
