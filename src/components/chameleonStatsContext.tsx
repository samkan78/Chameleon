import { createContext, useContext } from "react";

export type ChameleonStats = {
  hydration: number;
  health: number;
  energy: number;
  hunger: number;
  happiness: number;
};

export const ChameleonStatsContext = createContext<ChameleonStats | null>(null);

export const useChameleonStats = () => {
  const ctx = useContext(ChameleonStatsContext);
  if (!ctx) {
    throw new Error("useChameleonStats must be used inside ChameleonStatsContext.Provider");
  }
  return ctx;
};
