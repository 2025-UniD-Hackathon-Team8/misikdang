import React, { useState, useMemo, useEffect } from "react";
import ToggleTabs from "../components/ToggleTabs";
import RequestCardSmall from "../components/RequestCardSmall";
import ReviewModal from "../components/ReviewModal";
import { getGourmetProfile, setGourmetProfile } from "../utils/localStorage";
import type { ProfileData } from "../data/mockProfiles";

type ReviewItem = ProfileData["pendingReviews"][number];

const ProfileScreen: React.FC = () => {
  // localStorage에서 프로필 데이터 가져오기
  const profileData = getGourmetProfile() as ProfileData | null;

  // 프로필 데이터가 없으면 기본값 사용
  if (!profileData) {
    return <div>프로필을 불러오는 중...</div>;
  }

  const {
    nickname,
    userId,
    joinDate,
    reviewTemperature,
    reviewCompletionRate,
    pendingReviews,
    recentReviews,
  } = profileData;

  const [activeTab, setActiveTab] = useState<"pendingReview" | "reviewHistory">(
    "pendingReview"
  );

  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNickname, setEditedNickname] = useState(nickname);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalData, setModalData] = useState<{
    review: ReviewItem;
    type: "pending" | "history";
  } | null>(null);

  const [currentProgress, setCurrentProgress] = useState(0);

  //const targetProgressWidth = `${reviewCompletionRate}%`;

  //const progressWidth = `${reviewCompletionRate}%`;

  useEffect(() => {
    // 100ms 지연 후 실제 완료율(reviewCompletionRate)로 설정하여 애니메이션 트리거
    const timer = setTimeout(() => {
      setCurrentProgress(reviewCompletionRate);
    }, 100);

    // cleanup 함수
    return () => clearTimeout(timer);
  }, [reviewCompletionRate]); // reviewCompletionRate가 변경될 때마다 재실행

  // 진행 바 너비는 currentProgress 상태에 따라 결정
  const animatedProgressWidth = `${currentProgress}%`;

  const reviewTabs = useMemo(
    () =>
      [
        { id: "pendingReview", label: "대기 중인 리뷰" },
        { id: "reviewHistory", label: "리뷰 내역" },
      ] as const,
    []
  );

  const handleTabSelect = (id: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(id as "pendingReview" | "reviewHistory");
      setIsAnimating(false);
    }, 150);
  };

  const handleCardClick = (review: ReviewItem, type: "pending" | "history") => {
    setModalData({ review, type }); // 클릭된 리뷰 데이터와 타입 저장
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setModalData(null); // 데이터 초기화
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // 저장 로직
      const updatedProfile = {
        ...profileData,
        nickname: editedNickname,
      };
      setGourmetProfile(updatedProfile);
      alert("프로필이 저장되었습니다!");
    } else {
      // 편집 모드로 전환
      setEditedNickname(nickname);
    }
    setIsEditing(!isEditing);
  };

  const UserAvatarSVG = () => (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="48" cy="48" r="48" fill="#FF6B35" />
      <circle cx="48" cy="38" r="14" fill="white" />
      <path d="M24 78c0-13.255 10.745-24 24-24s24 10.745 24 24" fill="white" />
    </svg>
  );

  return (
    <div className="h-dvh bg-white">
      <div className="h-full flex flex-col max-w-lg mx-auto relative p-4 mt-6">
        {/*
          주의: 이 flex-shrink-0 div에는 현재 p-4가 적용되어 있지만, 
          하단 리스트 렌더링 영역의 스크롤을 위해 p-4를 p-0으로 바꾸고 
          내부 div에 px-5를 적용하는 것이 일반적이나, 
          요청하신 부분 외는 최소한으로 수정합니다. 
        */}
        <div
          className="px-5 flex-shrink-0"
          style={{ paddingTop: "calc(32px + env(safe-area-inset-top))" }}
        >
          <div className="flex items-center mb-5 text-left">
            <div className="mr-4">
              <UserAvatarSVG />
            </div>
            <div className="justify-center flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedNickname}
                  onChange={(e) => setEditedNickname(e.target.value)}
                  className="text-2xl font-bold text-gray-900 border-b-2 border-gray-300 focus:border-orange-600 outline-none w-full px-1 py-1"
                  placeholder="닉네임 입력"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{nickname}</h1>
              )}
              <p className="text-sm text-gray-500 mt-1 ">{userId}</p>
              <p className="text-xs text-gray-500 mt-1">🗓️ {joinDate}</p>
            </div>
          </div>

          <button
            onClick={handleEditToggle}
            className="w-full border border-gray-900 py-2.5 rounded-md text-center mb-8 hover:bg-gray-100 transition duration-150"
          >
            <span className="text-base font-semibold text-gray-900">
              {isEditing ? "저장" : "프로필 수정"}
            </span>
          </button>

          <div className="mb-4">
            <p className="text-sm font-bold text-gray-700 text-left">
              리뷰온도
            </p>
            <h2 className="text-4xl font-bold text-orange-600 mb-2 text-left">
              {reviewTemperature}°C
            </h2>
            <div className="h-1.5 bg-gray-200 rounded-full ">
              {/* 3. 애니메이션 적용: transition-all duration-1000 클래스 추가 */}
              <div
                className="h-1.5 bg-orange-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: animatedProgressWidth }}
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-bold text-gray-800 text-left">
              리뷰 작성률 {reviewCompletionRate}%
            </p>
            <p className="text-xs text-gray-500 mt-1 text-left">
              표시될 만큼 미식한 식당의 리뷰를 작성했어요
            </p>
          </div>

          <div className="flex mb-5 justify-center">
            <ToggleTabs
              tabs={reviewTabs}
              activeTabId={activeTab}
              onTabSelect={handleTabSelect}
              className="mx-auto"
            />
          </div>
        </div>

        {/* 👇 수정된 부분: overflow-y-auto 영역에 px-5를 추가하여 리스트가 좌우 패딩을 갖도록 수정 */}
        <div
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isAnimating
              ? "opacity-0 translate-y-2"
              : "opacity-100 translate-y-0"
          }`}
          style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}
        >
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
                  onClick={() => handleCardClick(review, "pending")}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p className="text-base font-semibold">
                  작성할 리뷰가 대기 중입니다. 🍽️
                </p>
                <p className="text-sm mt-1">
                  맛있는 식사 후 리뷰를 작성해보세요!
                </p>
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
        {modalData && (
          <ReviewModal
            isOpen={isModalOpen}
            onClose={closeModal}
            reviewData={modalData.review}
            modalType={modalData.type}
            showRating={false}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
