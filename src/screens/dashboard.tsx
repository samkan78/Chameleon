import React from "react";
import ImageBox from "../components/image";
import "./dashboard.css";
import FourButtons from "../components/fourbuttons";
import HowToPlay from "../components/helpButton";

//defining the petname and pettype as props
interface ChameleonDashboard {
  petName: string;
  petType: string;
}


const Dashboard: React.FC<ChameleonDashboard> = ({ petName, petType }) => (
  <div className="dashboard-root">
    <aside className="left-panel">
      {/*using the imagebox to display chameleon images and animations */}
      <ImageBox src="/assets/chameleon.png" />
    </aside>
    {/*components to display the health and actions of the chameleon as well as the help button and more*/}
    <main className="dashboard-main">
      <h2>Chameleon Dashboard</h2>
      <p>Pet Name: {petName}</p>
      <p>Pet Type: {petType}</p>
      <FourButtons />
      <HowToPlay />
    </main>
  </div>
);

export default Dashboard;
