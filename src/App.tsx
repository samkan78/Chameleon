// React hooks for state, side effects, and mutable refs that persist across renders
import { useState, useEffect, useRef } from "react";

// React Router components for client-side routing and navigation
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// UI components and types for the chameleon selection flow
import { BoxComponent } from "./components/chameleonChooser";
import type { Chameleon } from "./components/chameleonChooser";
import { ChameleonNaming } from "./components/chameleonNaming";

// Page-level screens rendered by routes
import Dashboard from "./screens/dashboard";
import StartPage from "./screens/start-page";
import LoggingIn from "./screens/login";

// Google OAuth provider wraps app to enable Google login context
import { GoogleOAuthProvider } from "@react-oauth/google";

// Context provider to expose restart logic across the component tree
import { RestartProvider } from "./components/RestartContext";

// Firebase app instances for authentication and database access
import { auth, db } from "./firebase";

// Firebase auth helpers for Google sign-in and auth state listening
import {
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

// Firestore helpers for reading and writing user documents
import { doc, setDoc, getDoc } from "firebase/firestore";

// Type for Google OAuth credential response
import type { CredentialResponse } from "@react-oauth/google";

export default function App() {
  // Global app state for the selected chameleon (or null if not chosen)
  const [selectedChameleon, setSelectedChameleon] = useState<Chameleon | null>(
    null,
  );

  // Global app state for the pet name entered by the user
  const [petName, setPetName] = useState("");

  // Read Google client ID from environment variables at build time
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    // Provides Google OAuth context to all children
    <GoogleOAuthProvider clientId={clientId}>
      {/* Enables browser-based routing */}
      <Router>
        {/* Pass shared state down so routing logic can control progression */}
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
  // React Router hook to imperatively change routes
  const navigate = useNavigate();

  // UI state for showing the restart confirmation modal
  const [showRestartModal, setShowRestartModal] = useState(false);

  // Stores the authenticated Firebase user object
  const [user, setUser] = useState<any>(null);

  // Loading flag to prevent rendering before async data resolves
  const [isLoading, setIsLoading] = useState(true);

  // Ref used to debounce Firestore saves without triggering re-renders
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Subscribe to Firebase auth changes and update React state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Guard clause to avoid running effect without a logged-in user
    if (!user) return;

    // Async function to load persisted user data from Firestore
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        // Restore saved progress and redirect if setup already completed
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
    // Skip saving unless all required data exists
    if (!user || !selectedChameleon || !petName) return;

    // Clear any pending save to debounce rapid state changes
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    // Delay Firestore write to avoid excessive network requests
    saveTimeoutRef.current = window.setTimeout(async () => {
      await setDoc(
        doc(db, "users", user.uid),
        { selectedChameleon, petName },
        { merge: true }, // Merge prevents overwriting other user fields
      );
    }, 800);
  }, [selectedChameleon, petName, user]);

  const restartGame = async () => {
    // Reset React state back to initial values
    setSelectedChameleon(null);
    setPetName("");

    // Clear any locally cached progress
    localStorage.clear();

    // Persist reset state to Firestore if user is logged in
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        selectedChameleon: null,
        petName: null,
      });
    }

    // Close modal and redirect to starting route
    setShowRestartModal(false);
    navigate("/");
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    // Guard clause to ensure credential exists before authenticating
    if (!credentialResponse.credential) return;

    try {
      // Convert Google credential into Firebase-compatible credential
      const credential = GoogleAuthProvider.credential(
        credentialResponse.credential,
      );

      // Signs the user into Firebase and triggers auth state listener
      await signInWithCredential(auth, credential);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Render a loading placeholder while async auth/data resolves
  if (isLoading) {
    return <div style={{ textAlign: "center", marginTop: 50 }}>Loading…</div>;
  }

  return (
    // Context provider exposes restartGame to deeply nested components
    <RestartProvider value={{ restartGame }}>
      {/* Conditionally rendered modal based on React state */}
      {showRestartModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "2rem",
              borderRadius: "12px",
              border: "2px solid #333",
              textAlign: "center",
              color: "white",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Restart Game?</h2>
            <p style={{ marginBottom: "2rem", color: "#aaa" }}>
              This will delete your progress. Are you sure?
            </p>
            <div
              style={{ display: "flex", gap: "15px", justifyContent: "center" }}
            >
              <button onClick={restartGame}>Yes, Restart</button>
              <button onClick={() => setShowRestartModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Route definitions determine which screen renders for each path */}
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
                setSelectedChameleon(ch); // Lift selection state up
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
                  setPetName(name); // Persist name in React state
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

// Thin wrapper component to isolate login-specific props
function LoginPage({
  onPlayAsGuest,
  onGoogleLogin,
}: {
  onPlayAsGuest: () => void;
  onGoogleLogin: (credentialResponse: any) => void;
}) {
  return (
    <LoggingIn onPlayAsGuest={onPlayAsGuest} onGoogleLogin={onGoogleLogin} />
  );
}

// Wrapper component that passes selection callback into chooser UI
function ChoosePage({ onSelect }: { onSelect: (ch: Chameleon) => void }) {
  return <BoxComponent onContinue={onSelect} />;
}

// Wrapper component that passes naming callback into naming UI
function NamePage({
  chameleon,
  onNameSubmit,
}: {
  chameleon: Chameleon;
  onNameSubmit: (name: string) => void;
}) {
  return <ChameleonNaming chameleon={chameleon} onContinue={onNameSubmit} />;
}
