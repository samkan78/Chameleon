import { useState } from "react";
import ImageBox from "../components/image";
import "./dashboard.css";
import HealthBars from "../components/healthbars";
import FourButtons from "../components/fourbuttons";
import Money from "../components/money";
import HowToPlay from "../components/helpButton";

interface ChameleonDashboard {
  petName: string;
  petType: string;
}

const Dashboard: React.FC<ChameleonDashboard> = ({ petName, petType }) => {
  const [coins, setCoins] = useState(50);
  const [hydration, setHydration] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [hunger, setHunger] = useState(50);
  const [happiness, setHappiness] = useState(50);
  const [health, setHealth] = useState(50);

  return (
    <div className="dashboard-root">
      <aside className="left-panel">
        {/* Provide a default image path; replace with your asset or prop as needed */}
        <ImageBox src="/assets/chameleon.png" />
      </aside>

      <main className="dashboard-main">
        <h2>Chameleon Dashboard</h2>
        <p>Pet Name: {petName}</p>
        <p>Pet Type: {petType}</p>
        <Money coins={coins} />
        <HealthBars 
          energy={energy}
          hunger={hunger}
          happiness={happiness}
          health={health}
          hydration={hydration}
        />
        <FourButtons 
          petName={petName}
          coins={coins}
          setCoins={setCoins}
          hydration={hydration}
          setHydration={setHydration}
          energy={energy}
          setEnergy={setEnergy}
          hunger={hunger}
          setHunger={setHunger}
          happiness={happiness}
          setHappiness={setHappiness}
          health={health}
          setHealth={setHealth}
        />
        <HowToPlay />
      </main>
    </div>
  );
};

export default Dashboard;
