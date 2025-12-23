import React, { useState } from "react";
import "./fourbuttons.css";
import { unstable_batchedUpdates } from "react-dom";

type Category = "Health" | "Care" | "Tricks" | "Shop" | "Earn";

const actions: Record<Category, string[]> = {
  Health: [
    "Check Eyes",
    "Trim Nails",
    "Check Skin Shedding",
    "Clean Enclosure",
  ],
  Care: ["Bath", "Misting", "Feed", "Nap", "Adjust Tmperature"],
  Tricks: ["Climbing Practice", "Hand Approach"],
  Shop: ["Buy Crickets", "Buy Mealworms", "Purchase Branches"],
  Earn: ["Earn Points", "Redeem Rewards"],
};

const FourButtons: React.FC = () => {
  const [active, setActive] = useState<Category | null>(null);

  const toggleCategory = (category: Category) => {
    setActive(active === category ? null : category);
  };

  return (
    <div className="four-buttons-wrapper">
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

      {active && (
        <div className="sub-buttons">
          {actions[active].map((action) => (
            <button key={action} className="sub-btn">
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FourButtons;
