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
export default function HealthBars({ energy, hunger, happiness, health, hydration }: HealthBarsProps) {
  const healthBars: HealthBar[] = [
    { label: "Energy", current: energy, max: 100, color: "#432626ff" },
    { label: "Hunger", current: hunger, max: 100, color: "#432626ff" },
    { label: "Happiness", current: happiness, max: 100, color: "#432626ff" },
    { label: "Health", current: health, max: 100, color: "#432626ff" },
    { label: "Hydration", current: hydration, max: 100, color: "#432626ff" },
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
