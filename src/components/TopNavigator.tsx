import React from "react";
import { ChevronLeft } from "lucide-react"; // 아이콘 라이브러리 (lucide-react)

interface HeaderProps {
  title: string;
  onBackClick?: () => void; // 뒤로 가기 버튼 클릭 이벤트 핸들러 (옵션)
}

export default function TopNavigator({ title, onBackClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      {/* 왼쪽: 뒤로 가기 버튼 */}
      <button
        onClick={onBackClick}
        className="flex-shrink-0 rounded-full p-1 text-gray-700 hover:bg-gray-100"
        aria-label="뒤로 가기"
      >
        <ChevronLeft size={24} />
      </button>

      {/* 중앙: 제목 (텍스트가 길 경우를 대비해 truncate 적용) */}
      <h1 className="truncate text-lg font-semibold text-gray-900">
        {title}
      </h1>

      {/* 오른쪽: F-Layout을 위한 빈 공간 (중앙 정렬 유지) */}
      <div className="w-8 flex-shrink-0" />
    </header>
  );
}