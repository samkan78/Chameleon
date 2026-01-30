// React import for component definition and local state management
import React, { useState } from "react";

// React Router hook for programmatic navigation
import { useNavigate } from "react-router-dom";

// Component-scoped CSS for dashboard layout and styling
import "./dashboard.css";

// Child component that renders the main action buttons
import FourButtons from "../components/fourbuttons";

// Optional help UI component (icon-style button)
import HowToPlay from "../components/helpButton";

// Component that displays top-level stats (level, coins, food)
import StatsDisplay from "../components/statsDisplay";

// Custom context hook that exposes global restart logic
import { useRestart } from "../components/RestartContext";

// Type definition enforces required props for the dashboard
export type ChameleonDashboard = {
  image: string;
  petName: string;
  petType: string;
  userId: string | null;
};

// Dashboard is a stateful React function component
const Dashboard: React.FC<ChameleonDashboard> = ({
  petName,
  petType,
  userId,
}) => {
  // Router hook allows redirecting after sign-out or button clicks
  const navigate = useNavigate();

  // Consume restartGame function from context without prop drilling
  const { restartGame } = useRestart();

  // Local UI state tracks stats owned by this screen only
  const [stats, setStats] = useState({ level: 1, coins: 50, foodInventory: 0 });

  // Boolean state controls visibility of the help modal
  const [showHelp, setShowHelp] = useState(false);

  // Async handler signs user out of Firebase and redirects to home
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
    // Root container defines dashboard layout and positioning context
    <div className="dashboard-root">
      {/* Controlled component receives stats via props and re-renders on state change */}
      <StatsDisplay
        level={stats.level}
        coins={stats.coins}
        foodInventory={stats.foodInventory}
      />

      {/* Conditionally render Sign In button when no authenticated user exists */}
      {!userId && (
        <button
          onClick={() => navigate("/login")}
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            padding: "10px 20px",
            backgroundColor: "#1FCC1F",
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

      {/* Conditionally render Sign Out button when a user is authenticated */}
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

      {/* Restart button triggers global state reset via context */}
      <button
        onClick={restartGame}
        style={{
          position: "fixed",
          top: 85,
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

      {/* Help toggle button updates local state to show modal */}
      <button
        onClick={() => setShowHelp(true)}
        style={{
          position: "fixed",
          top: 150,
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

      {/* Conditional rendering displays modal based on showHelp state */}
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

            {/* Static instructional content rendered inside modal */}
            <p>1. Choose a species of chameleon.</p>
            <p>2. Type in a name for your chameleon.</p>
            <p>
              3. Take care of your chameleon by keeping its environment stable,
              maintaining its health, earning resources, and teaching behaviors.
            </p>
            <p>
              4. Use the in-game currency to purchase items from the store to
              manage energy, hunger, happiness, hydration, and temperature.
            </p>
            <p>
              5. Teach tricks or complete chores to earn currency, but avoid
              exhausting your chameleon.
            </p>

            {/* Button updates state to close the modal */}
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

      {/* Main dashboard content area */}
      <main className="dashboard-main">
        <h2>CammyCare Dashboard</h2>

        {/* Props rendered directly into UI */}
        <p>Pet Name: {petName}</p>
        <p>Pet Type: {petType}</p>

        {/* Child component lifts updated stats back up via callback */}
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
