import { useState } from "react";
import { WelcomeScreen } from "./screens/homepage";
import Dashboard from "./screens/dashboard";
import "./App.css";
//import { ToastContainer, toast } from "react-toastify";
//import "react-toastify/dist/ReactToastify.css";

function App() {
  const [petName, setPetName] = useState<string | null>(null);
  const [petType, setPetType] = useState<string | null>(null);

  const handleStart = (name: string, type: string) => {
    setPetName(name);
    setPetType(type);
    return true;
  };

  return (
    <div className="App">
      {petName && petType ? (
        <Dashboard petName={petName} petType={petType} />
      ) : (
        <WelcomeScreen onStart={handleStart} />
      )}
    </div>
  );
}

export default App;
