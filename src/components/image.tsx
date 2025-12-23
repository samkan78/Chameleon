import React from "react";

type Props = {
  src: string;
};

export default function ImageBox({ src }: Props) {
  return (
    <div style={boxStyle}>
      <img src={src} alt="image" style={imgStyle} />
    </div>
  );
}

const boxStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "rgba(255,255,255,0.2)", // transparent box
  padding: "12px",
};

const imgStyle: React.CSSProperties = {
  width: "80px",
};
