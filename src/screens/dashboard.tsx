import React from "react";
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

const Dashboard: React.FC<ChameleonDashboard> = ({ petName, petType }) => (
  <div className="dashboard-root">
    <aside className="left-panel">
      {/* Provide a default image path; replace with your asset or prop as needed */}
      <ImageBox src="/assets/chameleon.png" />
    </aside>

    <main className="dashboard-main">
      <h2>Chameleon Dashboard</h2>
      <p>Pet Name: {petName}</p>
      <p>Pet Type: {petType}</p>
      <HealthBars />
      <FourButtons />
      <Money />
      <HowToPlay />
    </main>
  </div>
);

export default Dashboard;
