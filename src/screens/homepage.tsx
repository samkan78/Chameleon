import { useState } from "react";
import HowToPlay from "../components/helpButton";

interface ChameleonTypeInfo {
  name: string;
  description: string;
}

type ChameleonType = "Jackson's" | "Nose-Horned" | "Panther";

interface WelcomeScreenProps {
  onStart: (name: string, type: string) => boolean;
}

const CHAMELEON_TYPES: Record<ChameleonType, ChameleonTypeInfo> = {
  "Jackson's": {
    name: "Jackson's Chameleon",
    description:
      "T. jacksonii is less territorial than most species of chameleons and can often be kept in small groups",
  },
  "Nose-Horned": {
    name: "Nose-Horned Chameleon",
    description:
      "The nose-horned chameleon is mostly an arboreal and solitary species. This species is primarily nocturnal, searching for food and mating at night. It uses its long tongue to catch prey, making it an efficient way.",
  },
  Panther: {
    name: "Panther Chameleon",
    description:
      "The panther chameleon is very territorial; aside from mating, it spends the majority of its life in isolation. When two males come into contact, they will change color and inflate their bodies, attempting to assert their dominance. Often these battles end at this stage, with the loser retreating, turning drab and dark colors.",
  },
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [petName, setPetName] = useState("");
  const [selectedType, setSelectedType] = useState<ChameleonType>("Jackson's");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"type" | "name">("type");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = petName.trim();

    if (!trimmedName) {
      setError("Please enter a name for your chameleon");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (trimmedName.length > 20) {
      setError("Name must be 20 characters or less");
      return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(trimmedName)) {
      setError("Name can only contain letters, numbers, and spaces");
      return;
    }

    onStart(trimmedName, selectedType);
  };

  return (
    <div>
      <div
        style={{ position: "fixed", top: "16px", right: "16px", zIndex: 100 }}
      >
        <HowToPlay />
      </div>

      <h1>Chameleon app</h1>
      <p>Choose a chameleon</p>

      {step === "type" ? (
        <div>
          <h2>Choose Your Chameleon</h2>

          {Object.entries(CHAMELEON_TYPES).map(([typeKey, typeInfo]) => (
            <button
              key={typeKey}
              onClick={() => setSelectedType(typeKey as ChameleonType)}
            >
              {typeInfo.name}
              <br />
              {typeInfo.description}
              {selectedType === typeKey && " ✓"}
            </button>
          ))}

          <button onClick={() => setStep("name")}>Continue</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <button type="button" onClick={() => setStep("type")}>
            Back
          </button>

          <p>{CHAMELEON_TYPES[selectedType].name}</p>

          <div>
            <label htmlFor="petName">Name Your Chameleon</label>
            <input
              id="petName"
              type="text"
              value={petName}
              onChange={(e) => {
                setPetName(e.target.value);
                setError("");
              }}
              placeholder="Enter a name..."
              maxLength={20}
              autoFocus
            />
            {error && <p>{error}</p>}
            <p>{petName.length}/20 characters</p>
          </div>

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}
