"use client";

import { HTMLAttributes, ReactNode } from "react";

type FontWeight =
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | "normal"
  | "bold"
  | "bolder"
  | "lighter";

interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "strong" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: number;
  weight?: FontWeight;
  children: ReactNode;
  spacing?: number;
  font?: string;
  cursor?: string;
  lineHeight?: string;
  align?: any;
  margin?: string;
  writingMode?: any;
  onClick?: () => void;
  whiteSpace?: any;
}

export const Text = ({
  as = "span",
  size = 18,
  children,
  weight = "normal",
  color = "black",
  spacing = 0,
  lineHeight = "normal",
  font = "ChosunGs",
  cursor = "auto",
  writingMode = "horizontal-tb",
  whiteSpace = "pre-wrap",
  align = "left",
  margin = "0px",
  onClick = () => {},
  style,
}: TextProps) => {
  const CustomTag = as as keyof JSX.IntrinsicElements;

  return (
    <CustomTag
      onClick={onClick}
      className="text"
      style={{
        fontSize: size,
        fontWeight: weight,
        color,
        cursor,
        letterSpacing: spacing,
        lineHeight,
        writingMode,
        whiteSpace,
        fontFamily: font,
        textAlign: align,
        margin,
        ...style,
      }}
    >
      {children}
    </CustomTag>
  );
};
