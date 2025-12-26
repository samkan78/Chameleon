import React from "react";

type MoneyProps = {
  coins: number;
};
//Show number of coins/money in top-right corner
export const Money: React.FC<MoneyProps> = ({ coins }) => {
  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
      <button style={{ width: 50, height: 50, backgroundColor: "black", color: "white" }} disabled>
        coins: {coins}
      </button>
    </div>
  );
};
