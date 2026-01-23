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
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { RestartAnytime } from "./components/restart";
import { RestartProvider } from "./components/RestartContext";
import { auth, db } from "./firebase";
import { signInWithCredential, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";


export default function App() {
  const [selectedChameleon, setSelectedChameleon] = useState<Chameleon | null>(null);
  const [petName, setPetName] = useState("");

  // NEW: store FourButtons stats
  const [chameleonStats, setChameleonStats] = useState<any>({});

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
          chameleonStats={chameleonStats}
          setChameleonStats={setChameleonStats} // pass setter to FourButtons
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
  chameleonStats,
  setChameleonStats,
}: {
  selectedChameleon: Chameleon | null;
  petName: string;
  setSelectedChameleon: (c: Chameleon | null) => void;
  setPetName: (name: string) => void;
  chameleonStats: any;
  setChameleonStats: (stats: any) => void;
}) {
  const navigate = useNavigate();
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<number | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Auth state:", currentUser ? "Signed in" : "Signed out");
      if (!currentUser) {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load chameleon selection and pet name when user signs in
  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        setIsLoading(true);
        try {
          // Try loading from Firestore first
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log("Loaded user data from Firestore:", data);
            
            if (data.selectedChameleon && data.petName) {
              setSelectedChameleon(data.selectedChameleon);
              setPetName(data.petName);
              setIsLoading(false);
              navigate('/dashboard');
              return;
            }
          }
          
          // Fallback to localStorage if Firestore has no data
          const savedChameleon = localStorage.getItem('selectedChameleon');
          const savedName = localStorage.getItem('petName');
          
          if (savedChameleon && savedName) {
            console.log("Loaded user data from localStorage (fallback)");
            setSelectedChameleon(JSON.parse(savedChameleon));
            setPetName(savedName);
            setIsLoading(false);
            navigate('/dashboard');
            return;
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          
          // If Firestore fails, try localStorage
          try {
            const savedChameleon = localStorage.getItem('selectedChameleon');
            const savedName = localStorage.getItem('petName');
            
            if (savedChameleon && savedName) {
              console.log("Loaded user data from localStorage (error fallback)");
              setSelectedChameleon(JSON.parse(savedChameleon));
              setPetName(savedName);
              setIsLoading(false);
              navigate('/dashboard');
              return;
            }
          } catch (localError) {
            console.error("Error loading from localStorage:", localError);
          }
        }
        setIsLoading(false);
      };
      loadUserData();
    }
  }, [user]);

  // Save chameleon selection whenever it changes
  useEffect(() => {
    if (selectedChameleon) {
      // Save to localStorage
      try {
        localStorage.setItem('selectedChameleon', JSON.stringify(selectedChameleon));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      
      // Save to Firestore if user is signed in (debounced)
      if (user && petName) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = window.setTimeout(async () => {
          try {
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
              selectedChameleon,
              petName,
              updatedAt: new Date().toISOString()
            }, { merge: true });
            console.log("Saved chameleon selection to Firestore");
          } catch (error) {
            console.error("Error saving to Firestore:", error);
          }
        }, 1000);
      }
    }
  }, [selectedChameleon, user, petName]);

  // Save pet name whenever it changes
  useEffect(() => {
    if (petName) {
      // Save to localStorage
      try {
        localStorage.setItem('petName', petName);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      
      // Save to Firestore if user is signed in (debounced)
      if (user && selectedChameleon) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = window.setTimeout(async () => {
          try {
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, {
              selectedChameleon,
              petName,
              updatedAt: new Date().toISOString()
            }, { merge: true });
            console.log("Saved pet name to Firestore");
          } catch (error) {
            console.error("Error saving to Firestore:", error);
          }
        }, 1000);
      }
    }
  }, [petName, user, selectedChameleon]);

  const restartGame = async () => {
    console.log("Restart triggered");
    setSelectedChameleon(null);
    setPetName("");
    
    // Clear localStorage
    try {
      localStorage.removeItem('selectedChameleon');
      localStorage.removeItem('petName');
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
    
    // Clear Firestore
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          selectedChameleon: null,
          petName: null,
          updatedAt: new Date().toISOString()
        });
        console.log("Cleared user data from Firestore");
      } catch (error) {
        console.error("Error clearing user data from Firestore:", error);
      }
    }
    
    setShowRestartModal(false);
    navigate("/");
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const credential = GoogleAuthProvider.credential(credentialResponse.credential);
      await signInWithCredential(auth, credential);
      console.log("Successfully signed in!");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setIsLoading(false);
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "20px",
        fontFamily: "sans-serif"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <RestartProvider value={{ restartGame }}>
      <RestartAnytime onRestart={() => setShowRestartModal(true)} />

      {showRestartModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}>
          <div style={{
            background: "white",
            padding: 20,
            borderRadius: 8,
            width: 300,
            textAlign: "center",
          }}>
            <h2 className="text-lg font-black text-gray-800">Restart Game?</h2>
            <p className="text-sm text-gray-500">Your progress will be lost.</p>

            <div className="flex gap-4">
              <button onClick={restartGame} className="btn btn-danger w-full">
                Confirm
              </button>
              <button onClick={() => setShowRestartModal(false)} className="btn btn-light w-full">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<ChoosePage onSelect={setSelectedChameleon} />} />
        <Route
          path="/name"
          element={selectedChameleon ? (
            <NamePage chameleon={selectedChameleon} onNameSubmit={setPetName} />
          ) : (
            <div>Please select a chameleon first.</div>
          )}
        />
        <Route
          path="/dashboard"
          element={selectedChameleon && petName ? (
            <Dashboard
              image={selectedChameleon.image}
              petName={petName}
              petType={selectedChameleon.name}
              userId={user?.uid || null}
            />
          ) : (
            <div>Please complete the steps first.</div>
          )}
        />
      </Routes>

      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
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
              fontWeight: "bold",
            }}
          >
            Sign Out ({user.email})
          </button>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Login Failed")}
          />
        )}
      </div>
    </RestartProvider>
  );
}

function ChoosePage({ onSelect }: { onSelect: (ch: Chameleon) => void }) {
  const navigate = useNavigate();
  return (
    <BoxComponent onContinue={(chameleon) => { onSelect(chameleon); navigate("/name"); }} />
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
      onContinue={(name) => { onNameSubmit(name); navigate("/dashboard"); }}
    />
  );
}
