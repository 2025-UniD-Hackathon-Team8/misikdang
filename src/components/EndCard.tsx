import { colors } from "../constants/colors";

interface EndCardProps {
  onReset: () => void;
}

export default function EndCard({ onReset }: EndCardProps) {
  return (
    <div
      className="absolute top-0 left-0 bg-white rounded-3xl shadow-2xl overflow-hidden"
      style={{
        width: "320px",
        height: "600px",
        left: "50%",
        marginLeft: "-160px",
        zIndex: 3,
      }}
    >
      <div className="flex flex-col items-center justify-center h-full p-8">
        {/* <div className="text-6xl mb-6">🍽️</div> */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          남은 카드가 없습니다
        </h2>
        <p
          className="text-base text-center mb-6"
          style={{ color: colors.gray1 }}
        >
          모든 추천 음식을 확인하셨습니다
        </p>
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-2xl font-bold text-base"
          style={{
            backgroundColor: colors.primary,
            color: colors.secondary,
          }}
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
}
