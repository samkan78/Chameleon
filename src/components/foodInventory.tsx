import React from "react";
//food inventory display component
type foodInventoryProps = {
  foodInventory: number;
};
// renders food inventory button
export const FoodInventory: React.FC<foodInventoryProps> = ({
  foodInventory,
}) => {
  return (
    <div style={{ position: "fixed", top: 55, left: 15, zIndex: 1000 }}>
      <button
        style={{
          width: 75,
          height: 35,
          backgroundColor: "#1a1a1a",
          color: "#90EE90",
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
        🍗 {foodInventory}
      </button>
    </div>
  );
};
