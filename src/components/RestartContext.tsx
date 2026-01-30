import { createContext, useContext } from "react";

type RestartContextType = {
  restartGame: () => void;
};
// context to manage restart game
// how it works: restartGame function throughout the components
const RestartContext = createContext<RestartContextType | null>(null);

export const useRestart = () => {
  const ctx = useContext(RestartContext);
  if (!ctx) {
    throw new Error("useRestart must be used within RestartProvider");
  }
  return ctx;
};

export const RestartProvider = RestartContext.Provider;
