export const foodCategories = [
  {
    type: "category" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    title: "햄부기 Hamburgers",
    subtitle: "생각 없을땐? 햄부기지 ㅇㅈ?",
    restaurants: [
      {
        name: "맥도날드 삼성역 8번출구점",
        rating: 4.9,
        reviewCount: 343,
        distance: "1.7km",
        thumbnail:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200",
      },
      {
        name: "버거킹 역삼점",
        rating: 4.8,
        reviewCount: 412,
        distance: "1.2km",
        thumbnail:
          "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=200",
      },
      {
        name: "쉐이크쉑 강남점",
        rating: 4.7,
        reviewCount: 289,
        distance: "2.1km",
        thumbnail:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200",
      },
      {
        name: "파이브가이즈 논현점",
        rating: 4.6,
        reviewCount: 198,
        distance: "2.5km",
        thumbnail:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200",
      },
      {
        name: "버거프레스 청담점",
        rating: 4.5,
        reviewCount: 156,
        distance: "3.0km",
        thumbnail:
          "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=200",
      },
    ],
  },
  {
    type: "category" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    title: "피자 Pizza",
    subtitle: "치즈 당기는 날엔 역시 피자지 뭐~",
    restaurants: [
      {
        name: "도미노피자 강남점",
        rating: 4.7,
        reviewCount: 521,
        distance: "1.3km",
        thumbnail:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200",
      },
      {
        name: "피자헛 역삼점",
        rating: 4.6,
        reviewCount: 445,
        distance: "1.8km",
        thumbnail:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200",
      },
      {
        name: "미스터피자 삼성점",
        rating: 4.5,
        reviewCount: 367,
        distance: "2.2km",
        thumbnail:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200",
      },
    ],
  },
  {
    type: "category" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800",
    title: "치킨 Chicken",
    subtitle: "오늘은 치맥데이! 🍗🍺",
    restaurants: [
      {
        name: "bhc치킨 강남점",
        rating: 4.8,
        reviewCount: 678,
        distance: "0.8km",
        thumbnail:
          "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=200",
      },
      {
        name: "교촌치킨 역삼점",
        rating: 4.7,
        reviewCount: 589,
        distance: "1.1km",
        thumbnail:
          "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=200",
      },
      {
        name: "굽네치킨 삼성점",
        rating: 4.6,
        reviewCount: 432,
        distance: "1.5km",
        thumbnail:
          "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=200",
      },
      {
        name: "네네치킨 논현점",
        rating: 4.5,
        reviewCount: 398,
        distance: "1.9km",
        thumbnail:
          "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=200",
      },
    ],
  },
  {
    type: "category" as const,
    imageUrl: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800",
    title: "한식 Korean Food",
    subtitle: "역시 우리 입맛엔 한식이지~",
    restaurants: [
      {
        name: "백채김치찌개 강남점",
        rating: 4.9,
        reviewCount: 756,
        distance: "0.5km",
        thumbnail:
          "https://images.unsplash.com/photo-1555126634-323283e090fa?w=200",
      },
      {
        name: "본죽 역삼점",
        rating: 4.6,
        reviewCount: 523,
        distance: "1.0km",
        thumbnail:
          "https://images.unsplash.com/photo-1555126634-323283e090fa?w=200",
      },
      {
        name: "김밥천국 삼성점",
        rating: 4.5,
        reviewCount: 892,
        distance: "0.7km",
        thumbnail:
          "https://images.unsplash.com/photo-1555126634-323283e090fa?w=200",
      },
    ],
  },
];

export const foodItems = [
  {
    type: "item" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    title: "슈퍼 햄부기",
    restaurant: "맥도날드 삼성역 8번 출구점",
    rating: 4.9,
    reviewCount: 343,
    distance: "1.7km",
    description:
      "육즙이 가득한 비프 패티와 신선한 야채, 특제 소스가 어우러진 프리미엄 햄버거입니다. 부드러운 참깨 번과 함께 즐기는 최고의 맛!",
    discount: 50,
  },
  {
    type: "item" as const,
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
    title: "크리스피 치킨버거",
    restaurant: "KFC 강남점",
    rating: 4.7,
    reviewCount: 289,
    distance: "2.1km",
    description:
      "바삭한 프라이드 치킨과 신선한 양상추, 마요네즈 소스가 조화를 이루는 치킨버거입니다.",
    discount: 100,
  },
  {
    type: "item" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800",
    title: "더블 치즈버거",
    restaurant: "버거킹 역삼점",
    rating: 4.8,
    reviewCount: 412,
    distance: "1.2km",
    description:
      "두 장의 비프 패티와 진한 체다 치즈가 듬뿍 들어간 프리미엄 더블 치즈버거입니다.",
    discount: 30,
  },
  {
    type: "item" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    title: "페퍼로니 피자",
    restaurant: "도미노피자 강남점",
    rating: 4.7,
    reviewCount: 521,
    distance: "1.3km",
    description:
      "매콤한 페퍼로니와 쫄깃한 모짜렐라 치즈가 가득한 클래식 피자입니다.",
    discount: 40,
  },
  {
    type: "item" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800",
    title: "황금올리브 치킨",
    restaurant: "bhc치킨 강남점",
    rating: 4.8,
    reviewCount: 678,
    distance: "0.8km",
    description:
      "바삭한 튀김옷과 올리브유의 고소함이 어우러진 프리미엄 치킨입니다.",
    discount: 20,
  },
];
