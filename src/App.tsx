// src/App.tsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import SPLoader from "./components/loading";
import StartPage from "./screens/start-page";
import LoggingIn from "./screens/login";
import { BoxComponent } from "./components/chameleonChooser";
import type { Chameleon } from "./components/chameleonChooser";
import { ChameleonNaming } from "./components/chameleonNaming";
import Dashboard from "./screens/dashboard";
import QandA from "./components/interactiveQandA";

function AppRoutes() {
  const [selectedChameleon, setSelectedChameleon] = useState<Chameleon | null>(
    null
  );
  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [health, setHealth] = useState(100);
  const [hunger, setHunger] = useState(100);
  const [happiness, setHappiness] = useState(100);
  const [energy, setEnergy] = useState(100);

  return (
    <>
      {loading && <SPLoader />}

      <Routes>
        {/* 0️⃣ Start screen */}
        <Route path="/" element={<StartPage />} />

        {/* 1️⃣ Login */}
        <Route
          path="/login"
          element={
            <LoggingIn
              onPlayAsGuest={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  navigate("/choose");
                }, 500);
              }}
            />
          }
        />

        {/* 2️⃣ Choose a chameleon */}
        <Route
          path="/choose"
          element={<ChoosePage onSelect={setSelectedChameleon} />}
        />

        {/* 3️⃣ Name the chameleon */}
        <Route
          path="/name"
          element={
            selectedChameleon ? (
              <NamePage
                chameleon={selectedChameleon}
                onNameSubmit={setPetName}
              />
            ) : (
              <div>Please select a chameleon first.</div>
            )
          }
        />

        {/* 4️⃣ Dashboard */}
        <Route
          path="/dashboard"
          element={
            selectedChameleon && petName ? (
              <>
                <Dashboard
                  petName={petName}
                  petType={selectedChameleon.name}
                  image={selectedChameleon.image}
                  health={health}
                  hunger={hunger}
                  happiness={happiness}
                  energy={energy}
                />
                <QandA />
              </>
            ) : (
              <div>Please complete the steps first.</div>
            )
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

/* =========================
   Page Components
   ========================= */

// Choose a chameleon
function ChoosePage({ onSelect }: { onSelect: (ch: Chameleon) => void }) {
  const navigate = useNavigate();

  return (
    <BoxComponent
      onContinue={(chameleon) => {
        onSelect(chameleon);
        navigate("/name");
      }}
    />
  );
}

// Name the chameleon
function NamePage({
  chameleon,
  onNameSubmit,
}: {
  chameleon: Chameleon;
  onNameSubmit: (name: string) => void;
}) {
  const navigate = useNavigate();

  return (
    <ChameleonNaming
      chameleon={chameleon}
      onContinue={(name) => {
        onNameSubmit(name);
        navigate("/dashboard");
      }}
    />
  );
}
