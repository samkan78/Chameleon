import React from "react";
import { useNavigate } from "react-router-dom";
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



const Dashboard: React.FC<ChameleonDashboard> = ({ petName, petType, userId }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { auth } = await import("../firebase");
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="dashboard-root">
      {/* Login/Sign Out buttons in top right */}
      {!userId && (
        <button
          onClick={() => navigate("/login")}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "10px 20px",
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontWeight: "bold",
            zIndex: 999,
          }}
        >
          Sign In
        </button>
      )}
      
      {userId && (
        <button
          onClick={handleSignOut}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "10px 20px",
            backgroundColor: "#db4437",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontWeight: "bold",
            zIndex: 999,
          }}
        >
          Sign Out
        </button>
      )}

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
