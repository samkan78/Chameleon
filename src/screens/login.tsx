// src/screens/login.tsx
import React from "react";

type LoggingInProps = {
  onPlayAsGuest: () => void;
};

export default function LoggingIn({ onPlayAsGuest }: LoggingInProps) {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <button onClick={onPlayAsGuest}>Play as Guest</button>
    </div>
  );
}
