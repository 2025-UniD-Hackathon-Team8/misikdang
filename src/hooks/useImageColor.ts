import { useEffect, useState } from "react";
import { colors } from "../constants/colors";

// 색상의 밝기를 계산하는 함수 (0-255)
const getLuminance = (r: number, g: number, b: number): number => {
  // 인간의 눈에 보이는 밝기 계산 공식
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

export const useImageColor = (imageUrl: string) => {
  const [color, setColor] = useState<string>("#FFB682");
  const [textColor, setTextColor] = useState<string>(colors.primary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const extractColor = async () => {
      try {
        setLoading(true);
        const img = new Image();
        img.crossOrigin = "Anonymous";

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            setColor("#FFB682");
            setTextColor(colors.primary);
            setLoading(false);
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // 이미지의 평균 색상 계산
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let r = 0,
            g = 0,
            b = 0;
          const pixelCount = data.length / 4;

          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }

          r = Math.floor(r / pixelCount);
          g = Math.floor(g / pixelCount);
          b = Math.floor(b / pixelCount);

          // 색상을 조금 더 밝고 채도있게 조정
          const adjustedR = Math.min(255, Math.floor(r * 1.3));
          const adjustedG = Math.min(255, Math.floor(g * 1.3));
          const adjustedB = Math.min(255, Math.floor(b * 1.3));

          const hexColor = `#${adjustedR
            .toString(16)
            .padStart(2, "0")}${adjustedG
            .toString(16)
            .padStart(2, "0")}${adjustedB.toString(16).padStart(2, "0")}`;

          // 밝기 계산 (0-255, 128 기준으로 어두운지 밝은지 판단)
          const luminance = getLuminance(adjustedR, adjustedG, adjustedB);
          const isDark = luminance < 128;

          setColor(hexColor);
          setTextColor(isDark ? colors.secondary : colors.primary);
          setLoading(false);
        };

        img.onerror = () => {
          setColor("#FFB682");
          setTextColor(colors.primary);
          setLoading(false);
        };

        img.src = imageUrl;
      } catch (error) {
        console.error("Error extracting color:", error);
        setColor("#FFB682");
        setTextColor(colors.primary);
        setLoading(false);
      }
    };

    extractColor();
  }, [imageUrl]);

  return { color, textColor, loading };
};
