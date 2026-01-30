import { createContext, useContext } from "react";

export type ChameleonStats = {
  hydration: number;
  health: number;
  energy: number;
  hunger: number;
  happiness: number;
};
// Create a context for chameleon stats with default value null
export const ChameleonStatsContext = createContext<ChameleonStats | null>(null);
// all pet healths are managed through this hook
export const useChameleonStats = () => {
  const ctx = useContext(ChameleonStatsContext);
  if (!ctx) {
    throw new Error(
      "useChameleonStats must be used inside ChameleonStatsContext.Provider",
    );
  }
  return ctx;
};
