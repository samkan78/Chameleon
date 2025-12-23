import React, { useState, useEffect } from "react";

export default function Money() {
  return (
    <div style={containerStyle}>
      <button style={buttonStyle} disabled>
        $100
      </button>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  position: "fixed",
  top: "10px",
  right: "10px",
  zIndex: 1000,
};

const buttonStyle: React.CSSProperties = {
  width: "50px",
  height: "50px",
  backgroundColor: "black",
  color: "white",
};
