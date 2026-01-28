import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import SPLoader from "./components/loading";
import StartPage from "./screens/start-page";
import LoggingIn from "./screens/login";
import { BoxComponent, type Chameleon } from "./components/chameleonChooser";
import { ChameleonNaming } from "./components/chameleonNaming";
import Dashboard from "./screens/dashboard";
import QandA from "./components/interactiveQandA";
import { RestartAnytime } from "./components/restart";
import { RestartProvider } from "./components/RestartContext";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { auth, db } from "./firebase";
import {
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function App() {
  const [selectedChameleon, setSelectedChameleon] = useState<Chameleon | null>(null);
  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState(100);
  const [hunger, setHunger] = useState(100);
  const [happiness, setHappiness] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [chameleonStats, setChameleonStats] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRestartModal, setShowRestartModal] = useState(false);

  const saveTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  /** Listen for Firebase auth state changes */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      if (!currentUser) {
        console.log("User signed out");
      }
    });
    return () => unsubscribe();
  }, []);

  /** Load user data from Firestore or localStorage */
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.selectedChameleon && data.petName) {
            setSelectedChameleon(data.selectedChameleon);
            setPetName(data.petName);
            setIsLoading(false);
            navigate("/dashboard");
            return;
          }
        }

        // Fallback to localStorage
        const savedChameleon = localStorage.getItem("selectedChameleon");
        const savedName = localStorage.getItem("petName");

        if (savedChameleon && savedName) {
          setSelectedChameleon(JSON.parse(savedChameleon));
          setPetName(savedName);
          setIsLoading(false);
          navigate("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }

      setIsLoading(false);
    };

    loadUserData();
  }, [user, navigate]);

  /** Save selectedChameleon and petName to localStorage & Firestore (debounced) */
  useEffect(() => {
    if (!selectedChameleon && !petName) return;

    // Save to localStorage
    if (selectedChameleon) localStorage.setItem("selectedChameleon", JSON.stringify(selectedChameleon));
    if (petName) localStorage.setItem("petName", petName);

    // Save to Firestore
    if (user && selectedChameleon && petName) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = window.setTimeout(async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(
            userDocRef,
            { selectedChameleon, petName, updatedAt: new Date().toISOString() },
            { merge: true }
          );
          console.log("Saved to Firestore");
        } catch (error) {
          console.error("Error saving to Firestore:", error);
        }
      }, 1000);
    }
  }, [selectedChameleon, petName, user]);

  /** Restart game */
  const restartGame = async () => {
    setSelectedChameleon(null);
    setPetName("");

    // Clear localStorage
    localStorage.removeItem("selectedChameleon");
    localStorage.removeItem("petName");

    // Clear Firestore
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { selectedChameleon: null, petName: null, updatedAt: new Date().toISOString() });
      } catch (error) {
        console.error("Error clearing Firestore:", error);
      }
    }

    setShowRestartModal(false);
    navigate("/");
  };

  /** Google login */
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const credential = GoogleAuthProvider.credential(credentialResponse.credential);
      await signInWithCredential(auth, credential);
      console.log("Logged in with Google!");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  /** Sign out */
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("Signed out");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isLoading || loading) return <SPLoader />;

  return (
    <RestartProvider value={{ restartGame }}>
      {showRestartModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
            <h2>Restart Game?</h2>
            <p>Your progress will be lost.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button onClick={restartGame} style={{ flex: 1 }}>Confirm</button>
              <button onClick={() => setShowRestartModal(false)} style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <RestartAnytime onRestart={() => setShowRestartModal(true)} />

      <Routes>
        <Route path="/" element={<StartPage />} />

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

        <Route
          path="/choose"
          element={
            <BoxComponent
              onContinue={(chameleon: Chameleon) => {
                setSelectedChameleon(chameleon);
                navigate("/name");
              }}
            />
          }
        />

        <Route
          path="/name"
          element={
            selectedChameleon ? (
              <ChameleonNaming
                chameleon={selectedChameleon}
                onContinue={(name: string) => {
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

      {/* Google Login / Sign Out button */}
      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        {user ? (
          <button
            onClick={handleSignOut}
            style={{
              padding: "10px 20px",
              backgroundColor: "#db4437",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Sign Out ({user.email})
          </button>
        ) : (
          <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log("Login Failed")} />
        )}
      </div>
    </RestartProvider>
  );
}

// Wrap the App with Router and GoogleOAuthProvider
export function RootApp() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <Router>
        <App />
      </Router>
    </GoogleOAuthProvider>
  );
}