import React, { useEffect } from "react";
// unterface defining the properties required by the YearsOld component
// takes in all pet stats and n age up callback function
interface AgeProps {
  health: number;
  hunger: number;
  happiness: number;
  energy: number;
  hydration: number;
  age: number;
  onAgeUp: () => void; // Function triggered when aging conditions are met
}
// YearsOld component displays the pet's age and checks if it should age up
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
    // check if all stats are 95 or above to trigger age up
    const allStatsHigh =
      health >= 90 &&
      hunger >= 90 &&
      happiness >= 90 &&
      energy >= 90 &&
      hydration >= 90;

    if (allStatsHigh) {
      onAgeUp();
    }
  }, [health, hunger, happiness, energy, hydration, onAgeUp]);
  // render the age display button
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
