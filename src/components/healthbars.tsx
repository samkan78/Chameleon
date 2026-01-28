
import "./healthbars.css";
import TemperatureBar from "./tempraturebar";

interface HealthBarProps {
  energy: number;
  hunger: number;
  happiness: number;
  health: number;
  hydration: number;
  temperature?: number;
  onIncreaseTemp?: () => void;
  onDecreaseTemp?: () => void;
  chameleonType?: 'panther' | 'jackson' | 'nose-horned';
  tempChangeUntil?: number | null;
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
  tempChangeUntil,
}: HealthBarsProps) {
  const healthBars: HealthBar[] = [
    { label: "Energy", current: energy, max: 100, color: "#432626ff" },
    { label: "Hunger", current: hunger, max: 100, color: "#432626ff" },
    { label: "Happiness", current: happiness, max: 100, color: "#432626ff" },
    { label: "Health", current: health, max: 100, color: "#432626ff" },
    { label: "Hydration", current: hydration, max: 100, color: "#432626ff" },
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
          <span className="health-percent">{bar.current}%</span>
        </div>
      ))}
      {typeof temperature === "number" && (
        <TemperatureBar
          temperature={temperature}
          onIncrease={onIncreaseTemp}
          onDecrease={onDecreaseTemp}
          chameleonType={chameleonType}
          tempChangeUntil={tempChangeUntil}
        />
      )}
    </div>
  );
};

export default HealthBars;
