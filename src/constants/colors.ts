export const colors = {
  primary: "#000000",
  secondary: "#ffffff",
  background: "#fcfcfc",
  gray1: "#666666",
  gray2: "#aaaaaa",
} as const;

export type ColorKey = keyof typeof colors;
