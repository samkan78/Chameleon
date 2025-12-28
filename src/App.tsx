import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { BoxComponent } from "./components/chameleonChooser";
import type { Chameleon } from "./components/chameleonChooser";
import { ChameleonNaming } from "./components/chameleonNaming";
import Dashboard from "./screens/dashboard";

export default function App() {
  const [selectedChameleon, setSelectedChameleon] = useState<Chameleon | null>(
    null
  );
  const [petName, setPetName] = useState("");

  return (
    <Router>
      <Routes>
        {/* 1️⃣ Choose a chameleon */}
        <Route
          path="/"
          element={<ChoosePage onSelect={setSelectedChameleon} />}
        />

        {/* 2️⃣ Name the chameleon */}
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

        {/* 3️⃣ Dashboard */}
        <Route
          path="/dashboard"
          element={
            selectedChameleon && petName ? (
              <Dashboard petName={petName} petType={selectedChameleon.name} />
            ) : (
              <div>Please complete the steps first.</div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

function ChoosePage({ onSelect }: { onSelect: (ch: Chameleon) => void }) {
  const navigate = useNavigate();

  return (
    <BoxComponent
      onContinue={(chameleon) => {
        onSelect(chameleon);
        navigate("/name"); // 🔥 use navigate() instead of window.location
      }}
    />
  );
}

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
        navigate("/dashboard"); // 🔥 also use navigate() here
      }}
    />
  );
}
