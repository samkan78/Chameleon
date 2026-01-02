import React from "react";
import "../screens/dashboard.css";
interface TemperatureBarProps {
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
}

export default function TemperatureBar({
  currentTemp,
  minTemp = 0,
  maxTemp = 110,
  // fill works by finding distance from the current temp to the beginning (min temp) and dividing that value by the total length to get the percent of the box filled in
}: TemperatureBarProps) {
  const fill = ((currentTemp - minTemp) / (maxTemp - minTemp)) * 100;
  

  return (
    <div className="temp-bar-container">
      <div className="temp-bar-bg">
        <div className="temp-bar-fill" style={{ width: `${fill}%` }} />
      </div>
      <div className="temp-label">{currentTemp}°F</div>
    </div>
  );

  
}
