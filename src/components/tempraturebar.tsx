import React from 'react';

type ChameleonType = 'panther' | 'jackson' | 'nose-horned';

interface TemperatureBarProps {
  temperature: number; // Fahrenheit
  min?: number;
  max?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  chameleonType?: ChameleonType;
  tempChangeUntil?: number | null;
}

const TemperatureBar: React.FC<TemperatureBarProps> = ({
  temperature,
  min = 30,
  max = 150,
  onIncrease,
  onDecrease,
  chameleonType = 'panther',
  tempChangeUntil,
}) => {
  const clamped = Math.max(min, Math.min(max, temperature));
  const percent = ((clamped - min) / (max - min)) * 100;

  // Good temperature zones per chameleon type
  const goodZones: Record<ChameleonType, [number, number]> = {
    'panther': [85, 95],
    'jackson': [70, 80],
    'nose-horned': [83, 87],
  };
  const [goodMin, goodMax] = goodZones[chameleonType];
  const isInGoodZone = temperature >= goodMin && temperature <= goodMax;

  // Format time remaining
  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  const timeUntilChange = tempChangeUntil ? Math.max(0, tempChangeUntil - Date.now()) : 0;

  let color = '#60a5fa';
  if (isInGoodZone) color = '#4ade80'; // Green for good zone
  else if (temperature >= 85) color = '#f87171'; // Red for too hot
  else if (temperature >= 70) color = '#f59e0b'; // Orange for warm

  return (
    <div className="health-bar-container">
      <button onClick={onIncrease}>+</button>
      <button onClick={onDecrease}>-</button>
      <label className="health-label">
        Temperature {isInGoodZone ? '✓' : '✗'} ({goodMin}-{goodMax}°F)
      </label>
      <div className="health-bar-bg">
        <div
          className="health-bar-fill"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: color }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="health-percent">{Math.round(temperature)}°F</span>
        {tempChangeUntil && tempChangeUntil > Date.now() && (
          <span className="health-percent" style={{ fontSize: '0.75rem', color: '#999' }}>
            Change in: {formatTime(timeUntilChange)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TemperatureBar;