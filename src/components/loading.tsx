// src/components/SPLoader.tsx

import Spinner from "../assets/Spinner.svg";

export default function SPLoader() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
      }}
    >
      <img src={Spinner} alt="Loading..." />
    </div>
  );
}
