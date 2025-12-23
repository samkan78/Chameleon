import React from "react";
import "./healthbars.css";

interface HealthBar {
  label: string;
  current: number;
  max: number;
  color: string;
}

export default function HealthBars() {
  const healthBars: HealthBar[] = [
    { label: "Energy", current: 50, max: 100, color: "#432626ff" },
    { label: "Hunger", current: 50, max: 100, color: "#432626ff" },
    { label: "Happiness", current: 50, max: 100, color: "#432626ff" },
    { label: "Temperature Comfort", current: 50, max: 100, color: "#432626ff" },
    { label: "Hydration", current: 50, max: 100, color: "#432626ff" },
  ];

  return (
    <div className="health-box">
      {healthBars.map((bar) => (
        <div key={bar.label} className="health-bar-container">
          <label className="health-label">{bar.label}</label>
          <div className="health-bar-bg">
            <div
              className="health-bar-fill"
              style={{
                width: `${(bar.current / bar.max) * 100}%`,
                backgroundColor: bar.color,
              }}
            />
          </div>
          <span className="health-percent">{bar.current}%</span>
        </div>
      ))}
    </div>
  );
}
