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
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}
    >
      <Router>
        <AppWithRestart
          setSelectedChameleon={setSelectedChameleon}
          setPetName={setPetName}
          selectedChameleon={selectedChameleon}
          petName={petName}
        />
      </Router>
    </GoogleOAuthProvider>
  );
}



function AppWithRestart({
  setSelectedChameleon,
  setPetName,
  selectedChameleon,
  petName,
}: {
  setSelectedChameleon: (c: Chameleon | null) => void;
  setPetName: (name: string) => void;
  selectedChameleon: Chameleon | null;
  petName: string;
}) {
  const navigate = useNavigate();

  // SINGLE SOURCE OF TRUTH
  const restartGame = () => {
    console.log("Restart triggered");
    setSelectedChameleon(null);
    setPetName("");
    navigate("/");
  };

  return (
    <RestartProvider value={{ restartGame }}>
      {/* Global restart button (always visible) */}
      <RestartAnytime onRestart={restartGame} />

      <Routes>
        {/* Choose a chameleon */}
        <Route
          path="/"
          element={<ChoosePage onSelect={setSelectedChameleon} />}
        />

        {/* Name the chameleon */}
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

        {/* Dashboard (FourButtons lives here) */}
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

      {/* Google login (optional placement) */}
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
