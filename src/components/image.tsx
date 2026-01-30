import React from "react";

type displayImageProps = {
  displayImage: string;
};
// ImagBox component to display image inside a box called ImageBox
export default function ImageBox({ displayImage }: displayImageProps) {
  return (
    <div style={boxStyle}>
      <img src={displayImage} alt="image" style={imgStyle} />
    </div>
  );
}
// styles for the image box and image
const boxStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "rgba(255,255,255,0.2)", // transparent box
  padding: "12px",
};

const imgStyle: React.CSSProperties = {
  width: "80px",
};
