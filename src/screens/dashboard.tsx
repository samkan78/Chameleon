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
import { useNavigate } from "react-router-dom";

// Named export, safe to paste into any file
export function TopLeftLoginButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/login")}
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        padding: "10px 16px",
        backgroundColor: "#4285F4",
        color: "#fff",
        fontWeight: "bold",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        zIndex: 1000,
        fontFamily: "sans-serif",
        transition: "transform 0.1s",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      Login
    </button>
  );
}

const Dashboard: React.FC<ChameleonDashboard> = ({ petName, petType }) => {
  return (
    <div className="dashboard-root">

      {/* Components to display the health and actions of the chameleon */}
      <TopLeftLoginButton />
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
