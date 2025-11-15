import React, { useState } from "react";

// Props의 타입 정의
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 리뷰 데이터 타입은 ProfileScreen에서 정의한 것을 재활용
  reviewData: {
    restaurantName: string;
    visitDate: string;
    // 추후 실제 리뷰 내용도 포함될 수 있음
    reviewContent?: string;
  };
  // 'pending': 작성/수정 모드 (image_4cee38.png 스타일)
  // 'history': 조회 모드 (image_4cf0e1.png 또는 image_4cee01.png 스타일)
  modalType: "pending" | "history";
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

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, reviewData, modalType }) => {
  if (!isOpen) return null; // 모달이 닫혀있으면 아무것도 렌더링하지 않음

  // 폼 관련 상태 (리뷰 작성/수정 모드에 사용)
  const [favoritePoint, setFavoritePoint] = useState("");
  const [disappointPoint, setDisappointPoint] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [currentRating, setCurrentRating] = useState(0); // 별점 상태

  // 리뷰 내용을 보여주는 임시 텍스트 (실제 앱에서는 서버에서 받은 리뷰 내용을 사용)
  const sampleReviewText =
    "맛있었다고 맛있었다고 맛있었다고 맛있었다고 맛있었다고 맛있었다고 맛있었다고 맛있었다고 맛있었다고 맛있었다고 맛있었다고 맛있었다고 맛있었다고";

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
        {/* 닫기 버튼 */}

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
              <p className="text-sm text-gray-700 whitespace-pre-line">{reviewData.reviewContent || sampleReviewText}</p>
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
              <p className="text-sm text-gray-700 whitespace-pre-line">{reviewData.reviewContent || sampleReviewText}</p>
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
              <p className="text-sm text-gray-700 whitespace-pre-line">{reviewData.reviewContent || sampleReviewText}</p>
            )}
          </ReviewField>

          {/* 이거는 나중에 사장님할때 쓰삼
          {isHistory && (
            <div className="mt-4 pb-4">
              <StarRating rating={currentRating} onRate={setCurrentRating} isEditable={true} />
            </div>
          )}*/}
        </div>

        {/* 하단 액션 버튼 */}
        <div className="p-4 pt-0 sticky bottom-0 bg-white border-t border-gray-100 z-[1]">
          {isPending ? (
            // 리뷰 작성 모드 버튼 (image_4cee38.png)
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
