import React from "react";

//setting the props for monetary value will be used in fourbuttons.tsx
type MoneyProps = {
  coins: number;
};
//Show number of coins/money in top-right corner
export const Money: React.FC<MoneyProps> = ({ coins }) => {
  return (
    <div style={{ position: "fixed", top: 15, left: 15, zIndex: 1000 }}>
      <button
        style={{
          width: 75,
          height: 35,
          backgroundColor: "#1a1a1a",
          color: "#FFD700",
          fontWeight: "bold",
          fontSize: "0.8rem",
          border: "2px solid #333",
          borderRadius: "6px",
          cursor: "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
          transition: "all 0.2s ease",
        }}
        disabled
      >
        💰 {coins}
      </button>
    </div>
  );
};
