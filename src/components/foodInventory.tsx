import React from "react";
//food inventory display component
type foodInventoryProps = {
  foodInventory: number;
};

export const FoodInventory: React.FC<foodInventoryProps> = ({ foodInventory }) => {
  return (
    <div style={{ position: "fixed", top: 60, left: 10, zIndex: 1000 }}>
      <button
        style={{
          width: 80,
          height: 40,
          backgroundColor: "#333",
          color: "#90EE90",
          fontWeight: "bold",
          border: "2px solid #666",
          cursor: "default",
        }}
        disabled
      >
        🍗 {foodInventory}
      </button>
    </div>
  );
};
