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
  image,
  health,
  hunger,
  happiness,
  energy,
}) => (
  <div className="dashboard-root">
    {/* Top Header Section */}
    <DashboardInformation petName={petName} petType={petType} />
    {/* The Main Flex Container */}{" "}
    <div className="central-action-area">
      {/* 1. LEFT: Health Bars */}

      {/* 2. MIDDLE: Chameleon Image */}
      <section className="chameleon-display">
        <ImageBox src={image} />
      </section>

      {/* 3. RIGHT: Four Buttons */}
      <aside className="controls-panel">
        <FourButtons />
      </aside>
    </div>
    {/* Bottom/Miscellaneous Section */}
    <footer className="dashboard-footer">
      <HowToPlay />
    </footer>
  </div>
);
export default Dashboard;
