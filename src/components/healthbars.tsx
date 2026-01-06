import React, { useEffect, useState } from "react";
import "./healthbars.css";
import TemperatureBar from "./temperature";

interface HealthBarProps {
  energy: number;
  hunger: number;
  happiness: number;
  health: number;
  hydration: number;
  temperature?: number;
  onIncreaseTemp?: () => void;
  onDecreaseTemp?: () => void;
  chameleonType?: "panther" | "jackson" | "nose-horned";
}

const getFillColor = (percent: number) => {
  if (percent >= 80) return "#1fcc1f"; // green
  if (percent >= 50) return "#cc7533"; // orange
  return "#a02914"; // red
};

const HealthBars: React.FC<HealthBarProps> = ({
  energy,
  hunger,
  happiness,
  health,
  hydration,
  temperature,
  onIncreaseTemp,
  onDecreaseTemp,
  chameleonType,
}) => {
  const [stats, setStats] = useState({
    energy,
    hunger,
    happiness,
    health,
    hydration,
  });

  // Decrease stats every 2 minutes by 10–15
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const newStats = { ...prev };
        for (let key in newStats) {
          const decrease = Math.floor(Math.random() * 6) + 10; // 10–15
          (newStats as any)[key] = Math.max(
            0,
            (newStats as any)[key] - decrease
          );
        }
        return newStats;
      });
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, []);

  const healthBarsArray = [
    { label: "Energy", current: stats.energy, max: 100 },
    { label: "Hunger", current: stats.hunger, max: 100 },
    { label: "Happiness", current: stats.happiness, max: 100 },
    { label: "Health", current: stats.health, max: 100 },
    { label: "Hydration", current: stats.hydration, max: 100 },
  ];

  return (
    <div className="health-box">
      {healthBarsArray.map((bar) => {
        const percent = Math.round((bar.current / bar.max) * 100);
        const color = getFillColor(percent);

        return (
          <div key={bar.label} className="health-bar-container">
            <label className="health-label">{bar.label}</label>
            <div className="health-bar-bg">
              <div
                className="health-bar-fill"
                style={{ width: `${percent}%`, backgroundColor: color }}
              />
            </div>
            <span className="health-percent">{percent}%</span>
          </div>
        );
      })}

      {typeof temperature === "number" && (
        <TemperatureBar
          temperature={temperature}
          onIncrease={onIncreaseTemp}
          onDecrease={onDecreaseTemp}
          chameleonType={chameleonType}
        />
      )}
    </div>
  );
};

export default HealthBars;
