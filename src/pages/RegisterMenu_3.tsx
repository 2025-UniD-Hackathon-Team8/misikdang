// src/registerMenu_3.tsx
import { useState, useRef, type ChangeEvent } from "react"; // useRef, ChangeEvent 추가
import Button from "../components/Button.tsx"; // 버튼 컴포넌트
import Header from "../components/Header.tsx"; // 헤더 컴포넌트
//import TabBar from "./components/TabBar"; // 탭바 컴포넌트
import { colors } from "../constants/colors.ts"; // 색상 상수

export default function RegisterMenu_3() {
  // 1. 이미지 미리보기 URL을 저장할 state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // 2. 숨겨진 file input에 접근하기 위한 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // 선택된 파일

    if (file) {
      // FileReader를 사용해 이미지 파일을 읽고 data URL로 변환
      const reader = new FileReader();
      reader.onloadend = () => {
        // 읽기가 완료되면 state에 data URL을 저장
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // 파일 선택이 취소된 경우 미리보기 제거
      setImagePreview(null);
    }
  };

  /**
   * 4. '파일 선택' 버튼 클릭 시 숨겨진 input을 클릭시키는 핸들러
   */
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click(); // ref를 통해 숨겨진 input 클릭
  };

  /**삭제 함수 */
  const handleDeleteButtonClick = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* 1. 헤더 */}
      <Header title="이미지 등록" onBackClick={() => window.history.back()} />

      {/* 2. 프로그레스 바 */}
      <div className="w-full px-4 py-3">
        <div className="flex h-1.5 w-full rounded-full bg-gray-200">
          <div className="h-1.5 w-full rounded-full bg-black"></div>
        </div>
      </div>

      {/* 3. 메인 컨텐츠*/}
      <div className="flex flex-grow flex-col p-4">
        {/* 3-1. 사진업로드*/}
        <form className="relative mb-4 w-full">
          <div>
            <label
              htmlFor="imageUpload" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이미지 등록
            </label>

            <div className="h-100 flex items-center justify-center w-full h-48 rounded-lg border border-gray-300 bg-gray-50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="이미지 미리보기"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400">이미지 미리보기</span>
              )}
            </div>
            <input
              id="imageUpload"
              type="file"
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*" 
            />
            <div className="w-full">
            <button
              type="button" 
              onClick={handleUploadButtonClick}
              className="w-1/2 mt-2  rounded-lg border border-gray-300 py-2 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              파일 선택
            </button>
            <button
              type="button" 
              onClick={handleDeleteButtonClick}
              className="w-1/2 mt-2 rounded-lg border border-gray-300 py-2 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              삭제하기
            </button>
          </div>
          </div>

          <div className="flex space-x-2 padding-top-3 mt-4 mb-2">
            {/* 수량 설정 */}
            <div className="w-2/3">
              <label
                htmlFor="menuQuantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                수량
              </label>
              <div className="relative">
                <input
                  id="menuQuantity"
                  type="text"
                  placeholder="예) 10"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 text-base focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
            </div>
          </div>
        </form>
        {/* 3-2. 다음 버튼 */}
        <div className="mt-4 w-full">
          <Button
            bgColor={colors.primary}
            fgColor={colors.secondary}
            className="w-full border border-gray-400 py-3 text-base font-semibold hover:bg-gray-100"
          >
            완료
          </Button>
        </div>
      </div>

      {/* 4. 하단 탭바 */}
      {/* <TabBar /> */}
    </div>
  );
}