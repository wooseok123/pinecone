import { ReactElement } from "react";

interface ButtonProps {
  bgColor?: string;
  padding?: string;
  radius?: string | number;
  children?: ReactElement;
  width?: string | number;
  cursor?: string;
}

export function Button({
  bgColor = "#000000",
  padding = "0px",
  radius = 0,
  cursor = "auto",
  width = "fit-content",
  children,
}: ButtonProps): ReactElement {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        padding,
        width,
        borderRadius: radius,
        cursor,
      }}
    >
      {children}
    </div>
  );
}
