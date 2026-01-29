import React from "react";

interface StatsDisplayProps {
  level: number;
  coins: number;
  foodInventory: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  level,
  coins,
  foodInventory,
}) => {
  const buttonStyle = {
    backgroundColor: "#1a1a1a",
    color: "white",
    fontWeight: "bold" as const,
    fontSize: "0.9rem",
    border: "2px solid #333",
    borderRadius: "8px",
    cursor: "default" as const,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
    transition: "all 0.2s ease",
    padding: "8px 12px",
    minWidth: "90px",
  };

  const containerStyle = {
    position: "fixed" as const,
    top: 20,
    right: 20,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: "10px",
    zIndex: 1000,
  };

  return (
    <div style={containerStyle}>
      {/* Level */}
      <button style={buttonStyle} disabled>
        📊 Level: {level}
      </button>

      {/* Coins */}
      <button
        style={{
          ...buttonStyle,
          color: "#FFD700",
        }}
        disabled
      >
        💰 {coins}
      </button>

      {/* Food Inventory */}
      <button
        style={{
          ...buttonStyle,
          color: "#90EE90",
        }}
        disabled
      >
        🍗 {foodInventory}
      </button>
    </div>
  );
};

export default StatsDisplay;
