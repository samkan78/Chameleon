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

// fix this code later and ask aadi
export const ChameleonNaming: React.FC<ChameleonNamingProps> = ({
  chameleon,
  onContinue,
}) => {
  const [name, setName] = useState("");
  const { open } = useContext(ToastContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only letters and spaces, max 20 chars
    if (/^[A-Za-z\s]*$/.test(value) && value.length <= 20) {
      setName(value);
    } else if (value === "") {
      setName("");
    }
  };

  const handleContinue = () => {
    if (name.trim() === "") {
      open(
        <div className="btn btn-danger">
          Please enter a name for your chameleon!
        </div>,
        3000
      );
      return;
    }

    open(
      <div className="btn btn-success">
        Your chameleon is now named <strong>{name.trim()}</strong>!
      </div>,
      3000
    );

    onContinue(name.trim());
  };

  return (
    <div className="box-container">
      <h1>{chameleon.name}</h1>
      <img src={chameleon.image} alt={chameleon.name} />
      <h2> Enter a name for your chameleon!</h2>
      <input
        className="name-input"
        type="text"
        value={name}
        onChange={handleInputChange}
        placeholder="Enter a name for your chameleon"
      />
      <button className="continue-btn" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};
