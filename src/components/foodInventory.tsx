import React from "react";
//food inventory display component
type foodInventoryProps = {
  foodInventory: number;
};

export const Money: React.FC<foodInventoryProps> = ({ foodInventory }) => {
  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
      <button
        style={{
          width: 50,
          height: 50,
          backgroundColor: "black",
          color: "white",
        }}
        disabled
      >
        foodInventory: {foodInventory}
      </button>
    </div>
  );
};
