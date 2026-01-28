import React from "react";
import "./dashboard.css";
import FourButtons from "../components/fourbuttons";
import HowToPlay from "../components/helpButton";


// Defining the petname, pettype, and userId as props
export type ChameleonDashboard = {
  image: string;
  petName: string;
  petType: string;
  userId: string | null;
};

const Dashboard: React.FC<ChameleonDashboard> = ({ petName, petType }) => {
  return (
    <div className="dashboard-root">

      {/* Components to display the health and actions of the chameleon */}
      <main className="dashboard-main">
        <h2>Chameleon Dashboard</h2>
        <p>Pet Name: {petName}</p>
        <p>Pet Type: {petType}</p>
        <FourButtons 
        petType={petType} 
        />
        <HowToPlay />
      </main>
    </div>
  );
};

export default Dashboard;
