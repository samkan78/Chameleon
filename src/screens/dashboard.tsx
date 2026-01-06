import React from "react";
import ImageBox from "../components/image";
import "./dashboard.css";
import FourButtons from "../components/fourbuttons";
import HowToPlay from "../components/helpButton";
import { Money } from "../components/money"; // Import Money component
import DashboardInformation from "../components/dashboardHeading";
import { YearsOld } from "../components/age";
// Defining the petName, petType, image, and years as props
interface ChameleonDashboard {
  petName: string;
  petType: string;
  image: string; // We need this
  health: number;
  hunger: number;
  happiness: number;
  energy: number;
}

const Dashboard: React.FC<ChameleonDashboard> = ({
  petName,
  petType,
  image, // Receive the selected image
  health,
  hunger,
  happiness,
  energy,
}) => (
  <div className="dashboard-root">
    <aside className="left-panel">
      {/* Show the chameleon selected earlier */}
      <ImageBox src={image} />
    </aside>

    <main className="dashboard-main">
      <DashboardInformation petName={petName} petType={petType} />
      {/* Display other components */}
      <FourButtons />
      <HowToPlay />
      {/* Display Money component with the current years */}
      {/* Pass years to Money component */}
    </main>
  </div>
);

export default Dashboard;
