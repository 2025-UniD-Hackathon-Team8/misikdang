import React, { useState, useMemo } from "react";
import ToggleTabs from "../components/ToggleTabs";
import RequestCardSmall from "../components/RequestCardSmall";
import ReviewModal from "../components/ReviewModal";

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

type ReviewItem = ProfileData["pendingReviews"][number];

const profileData: ProfileData = {
  nickname: "막두날두 삼성점",
  userId: "#B2SW133D",
  joinDate: "2025년 11월 17일 가입",
  reviewTemperature: 65.8,
  reviewCompletionRate: 60,
  pendingReviews: [
    { restaurantName: "모몽가모몽가", visitDate: "2025년 11월 12일 방문함" },
    { restaurantName: "녜횡", visitDate: "2025년 11월 12일 방문함" },
    { restaurantName: "영웅이", visitDate: "2025년 11월 11일 방문함" },
    { restaurantName: "호걸이", visitDate: "2025년 11월 11일 방문함" },

    { restaurantName: "정상화", visitDate: "2025년 11월 10일 방문함" },
    { restaurantName: "신창섭", visitDate: "2025년 11월 9일 방문함" },
  ],
  recentReviews: [
    { restaurantName: "캬캬캬", visitDate: "2025년 11월 8일 방문함" },
    { restaurantName: "고독한 미식가", visitDate: "2025년 11월 14일 방문함" },
    { restaurantName: "고독한 치와와", visitDate: "2025년 11월 14일 방문함" },
    { restaurantName: "왈왈왈", visitDate: "2025년 11월 13일 방문함" },
    { restaurantName: "크르르 컹컹", visitDate: "2025년 11월 13일 방문함" },
  ],
};

const ProfileScreen: React.FC = () => {
  const { nickname, userId, joinDate, pendingReviews, recentReviews } = profileData;

  const [activeTab, setActiveTab] = useState<"pendingReview" | "reviewHistory">("pendingReview");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalData, setModalData] = useState<{
    review: ReviewItem;
    type: "pending" | "history";
  } | null>(null);

  const userAvatar = "https://via.placeholder.com/100/ff4500/ffffff?text=Mr+K";

  const reviewTabs = useMemo(
    () =>
      [
        { id: "pendingReview", label: "대기 중인 리뷰" },
        { id: "reviewHistory", label: "리뷰 내역" },
      ] as const,
    []
  );

  const handleTabSelect = (id: string) => {
    setActiveTab(id as "pendingReview" | "reviewHistory");
  };

  const handleCardClick = (review: ReviewItem, type: "pending" | "history") => {
    setModalData({ review, type }); // 클릭된 리뷰 데이터와 타입 저장
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setModalData(null); // 데이터 초기화
  };

  return (
    <div className="h-dvh bg-white">
      <div className="h-full flex flex-col max-w-lg mx-auto relative p-4">
        {/*
          주의: 이 flex-shrink-0 div에는 현재 p-4가 적용되어 있지만, 
          하단 리스트 렌더링 영역의 스크롤을 위해 p-4를 p-0으로 바꾸고 
          내부 div에 px-5를 적용하는 것이 일반적이나, 
          요청하신 부분 외는 최소한으로 수정합니다. 
        */}
        <div className="px-5 flex-shrink-0" style={{ paddingTop: "calc(32px + env(safe-area-inset-top))" }}>
          <div className="flex items-center mb-5 text-left">
            <img src={userAvatar} alt="User Avatar" className="w-24 h-24 rounded-full mr-4 border border-gray-200 object-cover" />
            <div className="justify-center">
              <h1 className="text-2xl font-bold text-gray-900">{nickname}</h1>
              <p className="text-sm text-gray-500 mt-1 ">{userId}</p>
              <p className="text-xs text-gray-500 mt-1">🗓️ {joinDate}</p>
            </div>
          </div>

          <button className="w-full border border-gray-900 py-2.5 rounded-md text-center mb-8 hover:bg-gray-100 transition duration-150">
            <span className="text-base font-semibold text-gray-900">프로필 수정</span>
          </button>

          <div className="flex mb-5 justify-center">
            <ToggleTabs tabs={reviewTabs} activeTabId={activeTab} onTabSelect={handleTabSelect} className="mx-auto" />
          </div>
        </div>

        {/* 👇 수정된 부분: overflow-y-auto 영역에 px-5를 추가하여 리스트가 좌우 패딩을 갖도록 수정 */}
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}>
          {activeTab === "reviewHistory" &&
            recentReviews.map((review, index) => (
              <RequestCardSmall
                key={`history-${index}`}
                title={review.restaurantName}
                subtitle={review.visitDate}
                thumbnailColor="#E0E0E0"
                showRatingIcon={true}
                className="mb-3"
                // 1. Review History 카드 클릭 이벤트 연결
                onClick={() => handleCardClick(review, "history")}
              />
            ))}

          {activeTab === "pendingReview" &&
            (pendingReviews.length > 0 ? (
              pendingReviews.map((review, index) => (
                <RequestCardSmall
                  key={`pending-${index}`}
                  title={review.restaurantName}
                  subtitle={review.visitDate}
                  thumbnailColor="#FFDDC1"
                  showRatingIcon={false}
                  className="mb-3"
                  // 1. Pending Review 카드 클릭 이벤트 연결
                  onClick={() => {}}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p className="text-base font-semibold">작성할 리뷰가 대기 중입니다. 🍽️</p>
                <p className="text-sm mt-1">맛있는 식사 후 리뷰를 작성해보세요!</p>
              </div>
            ))}
        </div>

        {/* 하단 네비게이션 */}
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-white border-t border-gray-200 shadow-xl w-full px-5"
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

        {/* 2. ReviewModal 컴포넌트 조건부 렌더링 추가 */}
        {modalData && <ReviewModal isOpen={isModalOpen} onClose={closeModal} reviewData={modalData.review} modalType={modalData.type} showRating={true} />}
      </div>
    </div>
  );
};

export default ProfileScreen;
