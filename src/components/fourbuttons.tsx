// FourButtons.tsx
// FourButtons.tsx
import React, { useState } from "react";
import "./fourbuttons.css";
import dingSound from "../assets/ding.mp3"; // Import your audio file
import HealthBars from "./healthbars";
// ---------------------------
// defining categories and actions
// ---------------------------

//main buttons/categories
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
      {/*display coins*/}
      <Money coins={coins} />
      <HealthBars 
        energy={energy}
        hunger={hunger}
        happiness={happiness}
        health={health}
        hydration={hydration}
      />

      {/*mainbuttons and the function to show subbuttons*/}
      <div className="main-buttons">
        {(Object.keys(actions) as Category[]).map((category) => (
          <button
            key={category}
            className={`main-btn ${active === category ? "active" : ""}`}
            onClick={() => toggleCategory(category)} // showing subbuttons from predifened function
          >
            {category}
          </button>
        ))}
      </div>

      {/*subbuttons and their functions*/}
      {active && (
        <div className="sub-buttons">
          {actions[active].map((action) => {
            const cannotAfford =
              action.cost !== undefined && action.cost > 0 && coins < action.cost; // Disable if not enough coins
            const isTier2LockedTrick = action.tiertwotrick === true && !trickt2unlocked; // Disable if tier 2 trick not unlocked
            const isAlreadyUsed = action.hasLock && lockedActions.has(action.name); // Disable if locked action already used
            return (
              <button
                key={action.name}
                className="sub-btn"
                disabled={cannotAfford || isTier2LockedTrick || isAlreadyUsed}
                onClick={() => handleActionClick(action)}
              >
                {action.name}
                {action.cost !== undefined && ` — $${Math.abs(action.cost)}`} {/*checking if the value is negative so it can add if the action.cost is negative, earning coins*/}
                
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FourButtons;
