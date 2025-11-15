// src/registerMenu_2.tsx
import React from "react";
import { Search } from "lucide-react"; // 검색 아이콘
import Button from "../components/Button.tsx"; // 버튼 컴포넌트
import Header from "../components/Header.tsx"; // 헤더 컴포넌트
//import TabBar from "./components/TabBar"; // 탭바 컴포넌트
import { colors } from "../constants/colors.ts"; // 색상 상수


export default function RegisterMenu1() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* 1. 헤더 */}
      <Header title="위치 등록" onBackClick={() => window.history.back()} />

      {/* 2. 프로그레스 바 */}
      <div className="w-full px-4 py-3">
        <div className="flex h-1.5 w-full rounded-full bg-gray-200">
          {/* 현재 단계 (1/3) */}
          <div className="h-1.5 w-1/3 rounded-full bg-black"></div>
        </div>
      </div>

      {/* 3. 메인 컨텐츠 (지도 및 버튼) */}
      <div className="flex flex-grow flex-col p-4">
        {/* 3-1. 지번, 도로명 검색 폼 */}
        <form className="relative mb-4 w-full">
          <input
            type="text"
            placeholder="지번 / 도로명"
            className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 text-base focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-gray-400 hover:text-gray-700"
            aria-label="검색"
          >
            <Search size={20} />
          </button>
        </form>

        {/* 3-2. 지도 API 영역 (목업) */}
        <div className="flex flex-grow items-center justify-center rounded-lg bg-gray-200 text-gray-500">
          지도 API 영역 (예: Naver/Kakao Map)
        </div>

        {/* 3-3. 다음 버튼 */}
        <div className="mt-4 w-full">
          <Button
            bgColor={colors.secondary}
            fgColor={colors.primary}
            className="w-full border border-gray-400 py-3 text-base font-semibold hover:bg-gray-50"
          >
            다음
          </Button>
        </div>
      </div>

      {/* 4. 하단 탭바 */}
      {/* <TabBar /> */}
    </div>
  );
}