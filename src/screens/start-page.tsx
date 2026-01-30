import { useNavigate } from "react-router-dom";
import "../components/start-and-login.css";

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="play-container">
      <div className="content-container">
        <h1 className="title">
          <span className="title-chameleon">CammyCare</span>
        </h1>
        <p className="desc">Description</p>
        <button className="play-button" onClick={() => navigate("/login")}>
          <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Play Now
        </button>
      </div>
    </div>
  );
}
