export interface ProfileData {
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

export const gourmetProfile: ProfileData = {
  nickname: "미식한고독가",
  userId: "#B23DSW13",
  joinDate: "2025년 11월 15일 가입",
  reviewTemperature: 65.8,
  reviewCompletionRate: 60,
  pendingReviews: [
    { restaurantName: "KFC 종로점", visitDate: "2025년 11월 12일 방문함" },
    {
      restaurantName: "맘스터치 여의도점",
      visitDate: "2025년 11월 12일 방문함",
    },
    { restaurantName: "쉐이크쉑 청담점", visitDate: "2025년 11월 11일 방문함" },
    { restaurantName: "맥도날드 부산점", visitDate: "2025년 11월 11일 방문함" },
    {
      restaurantName: "이케아 광명점 푸드코트",
      visitDate: "2025년 11월 10일 방문함",
    },
    {
      restaurantName: "스타벅스 리저브 을지로점",
      visitDate: "2025년 11월 9일 방문함",
    },
    {
      restaurantName: "파리바게뜨 잠실점",
      visitDate: "2025년 11월 8일 방문함",
    },
  ],
  recentReviews: [
    {
      restaurantName: "맥도날드 삼성역 8번출구점",
      visitDate: "2025년 11월 14일 방문함",
    },
    {
      restaurantName: "맥도날드 삼성역 8번출구점",
      visitDate: "2025년 11월 14일 방문함",
    },
    { restaurantName: "버거킹 강남점", visitDate: "2025년 11월 13일 방문함" },
    { restaurantName: "롯데리아 홍대점", visitDate: "2025년 11월 13일 방문함" },
  ],
};

export const ownerProfile: ProfileData = {
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
