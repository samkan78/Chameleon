import React, { useState } from "react";
import "../screens/homepage.css";
import { useContext } from "react";
import ToastContext from "./ToastService";

interface Chameleon {
  name: string;
  description: string;
  image: string;
}

interface ChameleonNamingProps {
  chameleon: Chameleon;
  onContinue: (name: string) => void;
}
// Component for naming the chosen chameleon
// includes input validation and use toast service for success/error messages

// fix this code later and ask aadi
export const ChameleonNaming: React.FC<ChameleonNamingProps> = ({
  chameleon,
  onContinue,
}) => {
  const [name, setName] = useState("");
  const { open } = useContext(ToastContext);

  // input validation logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only letters and spaces, max 20 chars
    if (/^[A-Za-z\s]*$/.test(value) && value.length <= 20) {
      setName(value);
    } else if (value === "") {
      setName("");
    }
  };
  // submit and continue logic
  const handleContinue = () => {
    if (name.trim() === "") {
      open(
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          Please enter a name for your chameleon!
        </div>,
        3000, // duration in ms
      );
      return;
    }
    // success toast message
    open(
      <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
        Your chameleon is now named <strong>{name.trim()}</strong>!
      </div>,
      3000,
    );
    // small delay
    setTimeout(() => {
      onContinue(name.trim());
    }, 300);
  };

  return (
    <div className="app-container">
      <div className="box-container">
        {/*shows special name */}
        <h1>{chameleon.name}</h1>
        {/* shows current chameleon image */}
        <img src={chameleon.image} alt={chameleon.name} />
        <h2> Enter a name for your chameleon!</h2>
        <input
          className="name-input"
          type="text"
          value={name}
          onChange={handleInputChange}
          placeholder="Enter a name for your chameleon"
        />
        {/* primary action button */}
        <button className="continue-btn" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};
