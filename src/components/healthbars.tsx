import "./healthbars.css";

//defining the structure of each health bar
interface HealthBar {
  label: string;
  current: number;
  max: number;
  color: string;
}

//defining the props for healthbars to be used in fourbuttons.tsx
interface HealthBarsProps {
  energy: number;
  hunger: number;
  happiness: number;
  health: number;
  hydration: number;
}

//main healthbars function
export default function HealthBars({
  energy,
  hunger,
  happiness,
  health,
  hydration,
}: HealthBarsProps) {
  // array of health bars with their respective properties and setting max to the healthbars
  const healthBars: HealthBar[] = [
    { label: "Energy", current: energy, max: 100, color: "#FFD700" },
    { label: "Hunger", current: hunger, max: 100, color: "#FF8C42" },
    { label: "Happiness", current: happiness, max: 100, color: "#FF69B4" },
    { label: "Health", current: health, max: 100, color: "#FF4444" },
    { label: "Hydration", current: hydration, max: 100, color: "#4DA6FF" },
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
