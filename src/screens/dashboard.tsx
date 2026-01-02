import React from "react";
import "../screens/dashboard.css";
import FourButtons from "../components/fourbuttons";
import HowToPlay from "../components/helpButton";
import TemperatureBar from "../components/temperature";
//defining the petname and pettype as props
interface ChameleonDashboard {
  petName: string;
  petType: string;
  image: string;
}

const Dashboard: React.FC<ChameleonDashboard> = ({
  petName,
  petType,
  image,
}) => (
  <div className="dashboard-root">
    <aside className="left-panel">
      <img src={image} alt={petType} />
    </aside>

    {/*components to display the health and actions of the chameleon as well as the help button and more*/}
    <main className="dashboard-main">
      <h2>Chameleon Dashboard</h2>
      <p>Pet Name: {petName}</p>
      <p>Pet Type: {petType}</p>
      <TemperatureBar currentTemp={30} minTemp={0} maxTemp={110} />
      <FourButtons />
      <HowToPlay />
    </main>
  </div>
);

export default Dashboard;
