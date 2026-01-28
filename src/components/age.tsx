import React, { useEffect } from "react";

interface AgeProps {
  health: number;
  hunger: number;
  happiness: number;
  energy: number;
  hydration: number;
  age: number;
  onAgeUp: () => void;
}

export const YearsOld: React.FC<AgeProps> = ({
  health,
  hunger,
  happiness,
  energy,
  hydration,
  age,
  onAgeUp,
}) => {
  useEffect(() => {
    const allStatsHigh =
      health >= 95 &&
      hunger >= 95 &&
      happiness >= 95 &&
      energy >= 95 &&
      hydration >= 95;

    if (allStatsHigh) {
      onAgeUp();
    }
  }, [health, hunger, happiness, energy, hydration, onAgeUp]);

  return (
    <div style={{ position: "fixed", top: 110, right: 10, zIndex: 1000 }}>
      <button
        style={{
          width: 50,
          height: 50,
          backgroundColor: "black",
          color: "white",
          borderRadius: 5,
          border: "none",
          fontWeight: "bold",
        }}
        disabled
      >
        Age: {age}
      </button>
    </div>
  );
};
