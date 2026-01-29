import { useState, useEffect, useRef } from "react";
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
import StartPage from "./screens/start-page";
import LoggingIn from "./screens/login";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { RestartAnytime } from "./components/restart";
import { RestartProvider } from "./components/RestartContext";

import { auth, db } from "./firebase";
import {
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { CredentialResponse } from "@react-oauth/google";

export default function App() {
  const [selectedChameleon, setSelectedChameleon] =
    useState<Chameleon | null>(null);
  const [petName, setPetName] = useState("");

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
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
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          if (data.selectedChameleon && data.petName) {
            setSelectedChameleon(data.selectedChameleon);
            setPetName(data.petName);
            navigate("/dashboard");
          }
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };

    loadUserData();
  }, [user]);

  useEffect(() => {
    if (!user || !selectedChameleon || !petName) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = window.setTimeout(async () => {
      await setDoc(
        doc(db, "users", user.uid),
        { selectedChameleon, petName },
        { merge: true }
      );
    }, 800);
  }, [selectedChameleon, petName, user]);

  const restartGame = async () => {
    setSelectedChameleon(null);
    setPetName("");
    localStorage.clear();

    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        selectedChameleon: null,
        petName: null,
      });
    }

    setShowRestartModal(false);
    navigate("/");
  };

  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) return;

    const credential = GoogleAuthProvider.credential(
      credentialResponse.credential
    );
    await signInWithCredential(auth, credential);
  };

  if (isLoading) {
    return <div style={{ textAlign: "center", marginTop: 50 }}>Loading…</div>;
  }

  return (
    <RestartProvider value={{ restartGame }}>
      <RestartAnytime onRestart={() => setShowRestartModal(true)} />

      <Routes>
        <Route path="/" element={<StartPage />} />

        <Route
          path="/login"
          element={
            <LoginPage
              onPlayAsGuest={() => navigate("/choose")}
              onGoogleLogin={handleGoogleLogin}
            />
          }
        />

        <Route
          path="/choose"
          element={
            <ChoosePage
              onSelect={(ch) => {
                setSelectedChameleon(ch);
                navigate("/name");
              }}
            />
          }
        />

        <Route
          path="/name"
          element={
            selectedChameleon ? (
              <NamePage
                chameleon={selectedChameleon}
                onNameSubmit={(name) => {
                  setPetName(name);
                  navigate("/dashboard");
                }}
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
                image={selectedChameleon.image}
                petName={petName}
                petType={selectedChameleon.name}
                userId={user?.uid ?? null}
              />
            ) : (
              <div>Please complete setup.</div>
            )
          }
        />
      </Routes>
    </RestartProvider>
  );
}

/* ---------- Small Pages ---------- */

function LoginPage({
  onPlayAsGuest,
  onGoogleLogin,
}: {
  onPlayAsGuest: () => void;
  onGoogleLogin: (cred: CredentialResponse) => void;
}) {
  return (
    <LoggingIn
      onPlayAsGuest={onPlayAsGuest}
      onGoogleLogin={onGoogleLogin}
    />
  );
}

function ChoosePage({
  onSelect,
}: {
  onSelect: (ch: Chameleon) => void;
}) {
  return <BoxComponent onContinue={onSelect} />;
}

function NamePage({
  chameleon,
  onNameSubmit,
}: {
  chameleon: Chameleon;
  onNameSubmit: (name: string) => void;
}) {
  return (
    <ChameleonNaming
      chameleon={chameleon}
      onContinue={onNameSubmit}
    />
  );
}
