import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import FourButtons from "../components/fourbuttons";

import StatsDisplay from "../components/statsDisplay";
import { useRestart } from "../components/RestartContext";

// Defining the petname, pettype, and userId as props
export type ChameleonDashboard = {
  image: string;
  petName: string;
  petType: string;
  userId: string | null;
};

const Dashboard: React.FC<ChameleonDashboard> = ({
  petName,
  petType,
  userId,
}) => {
  const navigate = useNavigate();
  const { restartGame } = useRestart();
  const [stats, setStats] = useState({ level: 1, coins: 50, foodInventory: 0 });
  const [showHelp, setShowHelp] = useState(false);

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
      {/* Stats Display in top right (Level, Coins, Food) */}
      <StatsDisplay
        level={stats.level}
        coins={stats.coins}
        foodInventory={stats.foodInventory}
      />

      {/* Login/Sign In buttons in top left */}
      {!userId && (
        <button
          onClick={() => navigate("/login")}
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            padding: "10px 20px",
            backgroundColor: "#6C63FF",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
            zIndex: 999,
            fontSize: "0.9rem",
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
            left: 20,
            padding: "10px 20px",
            backgroundColor: "#FF6B6B",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
            zIndex: 999,
            fontSize: "0.9rem",
          }}
        >
          Sign Out
        </button>
      )}

      {/* Restart button below the sign in/out button */}
      <button
        onClick={restartGame}
        style={{
          position: "fixed",
          top: 70,
          left: 20,
          padding: "10px 20px",
          backgroundColor: "#FF9F43",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "bold",
          zIndex: 999,
          fontSize: "0.9rem",
        }}
      >
        Restart
      </button>

      {/* Help button below restart button */}
      <button
        onClick={() => setShowHelp(true)}
        style={{
          position: "fixed",
          top: 120,
          left: 20,
          padding: "10px 16px",
          backgroundColor: "#6C5CE7",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "bold",
          zIndex: 999,
          fontSize: "1rem",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ?
      </button>

      {/* Help Modal */}
      {showHelp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              width: "350px",
              borderRadius: "8px",
            }}
          >
            <h2>How to Play</h2>
            <p>1. Choose a species of chameleon.</p>
            <p>2. Type in a name for your chameleon.</p>
            <p>
              3. Take care of your chameleon by keeping its environment stable,
              maintaining its health, earning resources, and teaching behaviors.
            </p>
            <p>
              4. Use the in-game currency to purchase items from the store to
              take care of your chameleon and maintains the energy, hunger,
              happiness, temperature comfort, and hydration stats. Make sure the
              chameleon is kept happy and healthy! All of the stat bars will
              decrease every 2 minutes so make sure they do not decrease all the
              way! You can buy food from shop before you feed your chameleon.
              You need to get above a 90% on all the levels for your chameleon
              to move on to the next level.
            </p>
            <p>
              5. Make your chameleon learn tricks to gain in-game currency. You
              can also do chores to gain in-game currency. However, be mindful
              of its energy levels and do not overexert your chameleon.
            </p>

            {/* Close popup */}
            <button
              onClick={() => setShowHelp(false)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6C5CE7",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Components to display the health and actions of the chameleon */}
      <main className="dashboard-main">
        <h2>Chameleon Dashboard</h2>
        <p>Pet Name: {petName}</p>
        <p>Pet Type: {petType}</p>
        <FourButtons
          petType={petType}
          onStatsChange={(level, coins, foodInventory) => {
            setStats({ level, coins, foodInventory });
          }}
        />
      </main>
    </div>
  );
};

export default Dashboard;
