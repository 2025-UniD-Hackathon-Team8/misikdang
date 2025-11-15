import React, { useState } from "react";

// --- Types/Interfaces & Sample Data ---
interface ReviewItemProps {
  restaurantName: string;
  visitDate: string;
  imageSource: string;
}

interface ProfileData {
  nickname: string;
  userId: string;
  joinDate: string;
  reviewTemperature: number;
  reviewCompletionRate: number;
  pendingReviews: {
    restaurantName: string;
    visitDate: string;
  }[];
  recentReviews: {
    restaurantName: string;
    visitDate: string;
  }[];
}

const profileData: ProfileData = {
  nickname: "미식한고독가",
  userId: "#B23DSW13",
  joinDate: "2025년 11월 15일 가입",
  reviewTemperature: 65.8,
  reviewCompletionRate: 60,
  pendingReviews: [
    { restaurantName: "KFC 종로점", visitDate: "2025년 11월 12일 방문함" },
    { restaurantName: "맘스터치 여의도점", visitDate: "2025년 11월 12일 방문함" },
    { restaurantName: "쉐이크쉑 청담점", visitDate: "2025년 11월 11일 방문함" },
    { restaurantName: "맥도날드 부산점", visitDate: "2025년 11월 11일 방문함" },
    // 스크롤 확인을 위해 추가 더미 데이터
    { restaurantName: "이케아 광명점 푸드코트", visitDate: "2025년 11월 10일 방문함" },
    { restaurantName: "스타벅스 리저브 을지로점", visitDate: "2025년 11월 9일 방문함" },
    { restaurantName: "파리바게뜨 잠실점", visitDate: "2025년 11월 8일 방문함" },
  ],
  recentReviews: [
    { restaurantName: "맥도날드 삼성역 8번출구점", visitDate: "2025년 11월 14일 방문함" },
    { restaurantName: "맥도날드 삼성역 8번출구점", visitDate: "2025년 11월 14일 방문함" },
    // **스크롤 테스트를 위해 더미 데이터를 추가합니다.**
    { restaurantName: "버거킹 강남점", visitDate: "2025년 11월 13일 방문함" },
    { restaurantName: "롯데리아 홍대점", visitDate: "2025년 11월 13일 방문함" },
  ],
};

// --- Sub-Components ---
const ReviewItem: React.FC<ReviewItemProps> = ({ restaurantName, visitDate, imageSource }) => {
  return (
    <a href="#" className="flex items-center py-3 border-b border-gray-100 hover:bg-gray-50 transition duration-150">
      <img src={imageSource} alt="Review thumbnail" className="w-16 h-16 rounded-lg mr-4 bg-gray-200 object-cover" />
      <div className="flex-1">
        <h4 className="text-base font-semibold text-gray-900">{restaurantName}</h4>
        <p className="text-xs text-gray-500 mt-1">{visitDate}</p>
      </div>
    </a>
  );
};

// --- Main Component (수정됨) ---
const ProfileScreen: React.FC = () => {
  const { nickname, userId, joinDate, reviewTemperature, reviewCompletionRate, pendingReviews, recentReviews } = profileData;

  const [activeTab, setActiveTab] = useState<"pendingReview" | "reviewHistory">("pendingReview");

  const userAvatar = "https://via.placeholder.com/100/ff4500/ffffff?text=Mr+K";
  const reviewThumbnail = "https://via.placeholder.com/60?text=Burger";
  const progressWidth = `${reviewCompletionRate}%`;

  return (
    // 1. 전체 화면 높이 고정: h-dvh 및 배경색 설정
    <div className="h-dvh bg-white">
      {/* 2. 내부 컨테이너: h-full과 flex-col로 높이를 h-dvh에 맞춥니다. */}
      <div className="h-full flex flex-col max-w-lg mx-auto relative p-4">
        {/* 3. 고정될 상단 영역 (스크롤되지 않음) - 상단 Safe Area 적용 */}
        {/* 기존 pt-10을 제거하고, Safe Area 높이 + 기본 패딩 (예: 2rem=32px)을 calc로 합산 */}
        <div
          className="px-5 flex-shrink-0"
          // Safe Area 높이 (env(safe-area-inset-top)) + 원하는 기본 상단 여백(예: pt-8 = 32px)을 합산하여 상단 패딩 설정
          style={{ paddingTop: "calc(32px + env(safe-area-inset-top))" }}
        >
          {/* 프로필 헤더 */}
          <div className="flex items-center mb-5">
            <img src={userAvatar} alt="User Avatar" className="w-24 h-24 rounded-full mr-4 border border-gray-200 object-cover" />
            <div className="justify-center">
              <h1 className="text-2xl font-bold text-gray-900">{nickname}</h1>
              <p className="text-sm text-gray-500 mt-1">{userId}</p>
              <p className="text-xs text-gray-500 mt-1">🗓️ {joinDate}</p>
            </div>
          </div>

          {/* 프로필 수정 버튼 */}
          <button className="w-full border border-gray-900 py-2.5 rounded-md text-center mb-8 hover:bg-gray-100 transition duration-150">
            <span className="text-base font-semibold text-gray-900">프로필 수정</span>
          </button>

          {/* 리뷰 온도 섹션 */}
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-700 text-left">리뷰온도</p>
            <h2 className="text-4xl font-bold text-orange-600 mb-2 text-left">{reviewTemperature}°C</h2>
            <div className="h-1.5 bg-gray-200 rounded-full ">
              <div className="h-1.5 bg-orange-600 rounded-full" style={{ width: progressWidth }} />
            </div>
          </div>

          {/* 리뷰 작성률 섹션 */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-800 text-left">리뷰 작성률 {reviewCompletionRate}%</p>
            <p className="text-xs text-gray-500 mt-1 text-left">표시될 만큼 미식한 식당의 리뷰를 작성했어요</p>
          </div>
          {/* 리뷰 탭 버튼 (수정된 부분) */}
          <div className="flex mb-5">
            <div className="flex w-full bg-gray-100 rounded-[10px] p-1.5 shadow-inner">
              {/* 1. '대기 중인 리뷰' 버튼 */}
              <button
                // 상태 업데이트 핸들러 추가
                onClick={() => setActiveTab("pendingReview")}
                className={`flex-1 py-2 rounded-[10px] text-center transition duration-300 ease-in-out ${
                  activeTab === "pendingReview"
                    ? "bg-white shadow-md z-10 transform translate-y-px" // 활성화 스타일
                    : "bg-transparent" // 비활성화 스타일
                }`}
              >
                <span
                  className={`text-base font-semibold ${
                    activeTab === "pendingReview" ? "text-gray-900 font-bold" : "text-gray-700" // 텍스트 색상 변경
                  }`}
                >
                  대기 중인 리뷰
                </span>
              </button>

              {/* 2. '리뷰 내역' 버튼 */}
              <button
                // 상태 업데이트 핸들러 추가
                onClick={() => setActiveTab("reviewHistory")}
                className={`flex-1 py-2 rounded-[10px] text-center transition duration-300 ease-in-out ${
                  activeTab === "reviewHistory"
                    ? "bg-white shadow-md z-10 transform translate-y-px" // 활성화 스타일
                    : "bg-transparent" // 비활성화 스타일
                }`}
              >
                <span
                  className={`text-base font-semibold ${
                    activeTab === "reviewHistory" ? "text-gray-900 font-bold" : "text-gray-700" // 텍스트 색상 변경
                  }`}
                >
                  리뷰 내역
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. 리뷰 목록 섹션: 스크롤 영역 - 하단 Safe Area 적용 */}
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}>
          {/* Case 1: '리뷰 내역' 탭 활성화 시 */}
          {activeTab === "reviewHistory" &&
            recentReviews.map((review, index) => (
              <ReviewItem key={index} restaurantName={review.restaurantName} visitDate={review.visitDate} imageSource={reviewThumbnail} />
            ))}

          {/* Case 2: '대기 중인 리뷰' 탭 활성화 시 */}
          {activeTab === "pendingReview" &&
            // **pendingReviews 배열 길이에 따른 조건부 렌더링**
            (pendingReviews.length > 0 ? (
              // pendingReviews가 1개 이상일 경우: 목록을 표시
              pendingReviews.map((review, index) => (
                <ReviewItem key={index} restaurantName={review.restaurantName} visitDate={review.visitDate} imageSource={reviewThumbnail} />
              ))
            ) : (
              // pendingReviews가 0개일 경우: 안내 메시지 표시
              <div className="text-center py-10 text-gray-500">
                <p className="text-base font-semibold">작성할 리뷰가 대기 중입니다. 🍽️</p>
                <p className="text-sm mt-1">맛있는 식사 후 리뷰를 작성해보세요!</p>
              </div>
            ))}
        </div>

        {/* 5. 하단 탭 바: Absolute 고정 및 하단 Safe Area 적용 */}
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-white border-t border-gray-200 shadow-xl w-full px-5"
          // Safe Area 높이만큼 padding-bottom을 추가하여 홈 인디케이터와 겹치지 않게 함
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <a href="#" className="text-2xl text-gray-400 p-2">
            🍴
          </a>
          <a href="#" className="text-2xl text-gray-400 p-2">
            ✉️
          </a>
          <a href="#" className="text-2xl text-gray-900 p-2">
            👤
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
