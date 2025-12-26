// FourButtons.tsx
import React, { useState } from "react";
import "./fourbuttons.css";
import dingSound from "./ding.mp3"; // Import your audio file
// ---------------------------
// Types
// ---------------------------

type Category = "Health" | "Care" | "Tricks" | "Shop" | "Earn";

type Action = {
  name: string;
  cost?: number; // Positive = costs coins, Negative = earns coins
};

// ---------------------------
// Action Data
// ---------------------------

const actions: Record<Category, Action[]> = {
  Health: [
    { name: "Check Eyes" },
    { name: "Trim Nails" },
    { name: "Check Skin Shedding" },
    { name: "Clean Enclosure" },
  ],
  Care: [
    { name: "Bath" },
    { name: "Misting" },
    { name: "Feed" },
    { name: "Nap" },
    { name: "Adjust Temperature" },
  ],
  Tricks: [
    { name: "Climbing Practice" },
    { name: "Hand Approach" },
  ],
  Shop: [
    { name: "Buy Crickets", cost: 5 },
    { name: "Buy Mealworms", cost: 5 },
    { name: "Purchase Branches", cost: 10 },
  ],
  Earn: [
    { name: "Clean Room", cost: -5 },
    { name: "Do Homework", cost: -15 },
    { name: "Take a shower", cost: -10 },
    { name: "Do laundry", cost: -10 },
  ],
};

// ---------------------------
// Money Component
// ---------------------------

type MoneyProps = { coins: number };

const Money: React.FC<MoneyProps> = ({ coins }) => {
  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: 10,
    right: 10,
    zIndex: 1000,
  };

  const buttonStyle: React.CSSProperties = {
    width: 80,
    height: 40,
    backgroundColor: "black",
    color: "white",
    borderRadius: 5,
    border: "none",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} disabled>
        Coins: {coins}
      </button>
    </div>
  );
};
// ---------------------------
// FourButtons Component
// ---------------------------

const FourButtons: React.FC = () => {
  const [active, setActive] = useState<Category | null>(null);
  const [coins, setCoins] = useState(100);

  // Toggle main category
  const toggleCategory = (category: Category) => {
    setActive(active === category ? null : category);
  };

  // Handle clicking a sub-action
  const handleActionClick = (action: Action) => {
    if (action.cost !== undefined) {
      // Negative cost = earn coins
      setCoins(coins - action.cost);
      const audio = new Audio(dingSound);
      audio.play();

    }
  };

  return (
    <div className="four-buttons-wrapper">
      {/* Display coins */}
      <Money coins={coins} />

      {/* Main category buttons */}
      <div className="main-buttons">
        {(Object.keys(actions) as Category[]).map((category) => (
          <button
            key={category}
            className={`main-btn ${active === category ? "active" : ""}`}
            onClick={() => toggleCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sub-buttons */}
      {active && (
        <div className="sub-buttons">
          {actions[active].map((action) => {
            const cannotAfford =
              action.cost !== undefined && action.cost > 0 && coins < action.cost;
            return (
              <button
                key={action.name}
                className="sub-btn"
                disabled={cannotAfford}
                onClick={() => handleActionClick(action)}
              >
                {action.name}
                {action.cost !== undefined && ` — $${Math.abs(action.cost)}`}
                
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FourButtons;
