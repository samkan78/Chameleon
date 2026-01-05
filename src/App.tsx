import { useState } from "react";
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
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { RestartAnytime } from "./components/restart";
import { RestartProvider } from "./components/RestartContext";

export default function App() {
  const [selectedChameleon, setSelectedChameleon] =
    useState<Chameleon | null>(null);
  const [petName, setPetName] = useState("");

  console.log(
    "VITE_GOOGLE_CLIENT_ID:",
    import.meta.env.VITE_GOOGLE_CLIENT_ID
  );

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <Router>
        <AppWithRestart
          selectedChameleon={selectedChameleon}
          petName={petName}
          setSelectedChameleon={setSelectedChameleon}
          setPetName={setPetName}
        />
      </Router>
    </GoogleOAuthProvider>
  );
}

function AppWithRestart({
  selectedChameleon,
  petName,
  setSelectedChameleon,
  setPetName,
}: {
  selectedChameleon: Chameleon | null;
  petName: string;
  setSelectedChameleon: (c: Chameleon | null) => void;
  setPetName: (name: string) => void;
}) {
  const navigate = useNavigate();

  // modal state
  const [showRestartModal, setShowRestartModal] = useState(false);

  // restart thing actually happening
  const restartGame = () => {
    console.log("Restart triggered");
    setSelectedChameleon(null);
    setPetName("");
    setShowRestartModal(false);
    navigate("/");
  };

  return (
    <RestartProvider value={{ restartGame }}>
      {/* GLOBAL RESTART BUTTON */}
      <RestartAnytime onRestart={() => setShowRestartModal(true)} />

      {/* CONFIRMATION MODAL */}
      {showRestartModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 8,
              width: 300,
              textAlign: "center",
            }}
          >
            <h2 
            className="text-lg font-black text-gray-800"
            >Restart Game?</h2>
            <p
            className="text-sm text-gray-500"
            >Your progress will be lost.</p>

              <div className="flex gap-4">
              <button 
              onClick={restartGame} 
              className="btn btn-danger w-full">
                Confirm
              </button>

              <button 
              onClick={() => setShowRestartModal(false)}
              className="btn btn-light w-full">
                Cancel
              </button>
              </div>
          </div>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={<ChoosePage onSelect={setSelectedChameleon} />}
        />

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

        <Route
          path="/dashboard"
          element={
            selectedChameleon && petName ? (
              <Dashboard
                petName={petName}
                petType={selectedChameleon.name}
              />
            ) : (
              <div>Please complete the steps first.</div>
            )
          }
        />
      </Routes>

      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </RestartProvider>
  );
}

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
