import React, { useState } from "react";
// import css file homepage.css
import "../screens/homepage.css";

export interface Chameleon {
  name: string;
  description: string;
  image: string;
}
// Props that the component accepts.
interface BoxComponentProps {
  onContinue?: (chameleon: Chameleon) => void;
}

export const BoxComponent: React.FC<BoxComponentProps> = ({ onContinue }) => {
  // array of all 3 chameleons with name, description, and image.
  // Infinite cariousel component for selecting one of the three chameleons.
  const threeChameleons: Chameleon[] = [
    {
      name: "Panther Chameleon",
      description:
        "The panther chameleon is very territorial; aside from mating, it spends the majority of its life in isolation. When two males come into contact, they will change color and inflate their bodies, attempting to assert their dominance. Often these battles end at this stage, with the loser retreating, turning drab and dark colors.",
      image: "src/assets/chameleonImages/Panther Chameleon/Level 2/Panther Chameleon GREEN.png",
    },
    {
      name: "Jackson's Chameleon",
      description:
        "T. jacksonii is less territorial than most species of chameleons and can often be kept in small groups.",
      image: "src/assets/chameleonImages/Jackson's Chameleon/Level 2/Jackson's Chameleon Level 2 GREEN.png",
    },
    {
      name: "Nose-Horned Chameleon",
      description:
        "The nose-horned chameleon is mostly an arboreal and solitary species. This species is primarily nocturnal, searching for food and mating at night. It uses its long tongue to catch prey, making it an efficient way.",
      image: "src/assets/chameleons/nose-horned-green.png",
    },
  ];
  // defines the current position in the array of chameleons (0= first, 1 = second, 2=third)
  const [currentChameleonPos, setcurrentChameleonPos] = useState(0); // default state is 0 (first chameleon in order)

  // NAVIGATION LOGIC FOR ROTATING BETWEEN 3 CHAMELEONS

  const goRight = () => {
    // function to go to the next chameleon by using the index (position)
    setcurrentChameleonPos((prevPos) => (prevPos + 1) % threeChameleons.length);
  };
  const goLeft = () => {
    // function to go to the previous chameleon by using the index (position)
    setcurrentChameleonPos(
      (prevPos) =>
        (prevPos - 1 + threeChameleons.length) % threeChameleons.length
    );
  };

  // displays the chameleon based on the index
  const currentChameleon = threeChameleons[currentChameleonPos];
  return (
    <div className="box-container">
      {/*the box that all of the following goes in */}
      <h1>Choose your Chameleon</h1> {/*title for the component */}
      {/*arows to navigate the chameleons left and right */}
      <div className="arrow-and-chameleons">
        <button className="left-arrow-btn" onClick={() => goLeft()}>
          <img
            src="src/assets/left-arrow.png"
            alt="left arrow"
            className="arrow"
          />
        </button>
        {/* shows current chameleon image */}
        <img src={currentChameleon.image} alt={currentChameleon.name} />
        <button className="right-arrow-btn" onClick={() => goRight()}>
          <img
            src="src/assets/right-arrow.png"
            alt="right arrow"
            className="arrow"
          />
        </button>
      </div>
      {/* displays current chameleon name and description as text content */}
      <h2>{currentChameleon.name}</h2>
      <p>{currentChameleon.description}</p>
      {/* calls the parent callback*/}
      <button
        className="continue-btn"
        onClick={() => {
          if (onContinue) onContinue(currentChameleon);
        }}
      >
        Continue
      </button>
    </div>
  );
};
