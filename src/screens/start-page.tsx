import React from "react";
import { useNavigate } from "react-router-dom";
import playButton from "../assets/play-button.png";
import "../components/startScreens.css";

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="play-container">
      <h1 className="title">Chameleon App</h1>
      <button className="play-button" onClick={() => navigate("/login")}>
        <img src={playButton} alt="Play button" />
      </button>
    </div>
  );
}
