import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import dingSound from "../assets/ding.mp3";
import ToastContext from "../components/ToastService";

// ---------------------------
// defining categories and actions
// ---------------------------
export type Category = "Health" | "Care" | "Tricks" | "Shop" | "Earn";

export type Action = {
  name: string;
  cost?: number;
  energyValue?: number;
  hungerValue?: number;
  hydrationValue?: number;
  happinessValue?: number;
  healthValue?: number;
  hasFood?: boolean;
  hasLock?: boolean;
  cooldown?: number;
  unlockstier2tricks?: boolean;
  tiertwotrick?: boolean;
  isFood?: boolean;
};
// defining actions available in the game
export const actions: Record<Category, Action[]> = {
  Health: [
    { name: "Check Eyes", healthValue: 10, happinessValue: -10 },
    { name: "Trim Nails", healthValue: 5, happinessValue: -10 },
    { name: "Check Skin Shedding", healthValue: 15, happinessValue: -10 },
    { name: "Clean Enclosure", healthValue: 10, happinessValue: -10 },
    {
      name: "Vet Visit",
      cost: 75,
      healthValue: 50,
      happinessValue: -25,
      hydrationValue: 30,
      energyValue: -10,
      hungerValue: 30,
    },
  ],
  Care: [
    { name: "Bath" },
    { name: "Misting", hydrationValue: 20, cost: 4 },
    { name: "Feed", hungerValue: 15, hasFood: true },
    { name: "Nap", energyValue: 25, cooldown: 2 },
    { name: "Adjust Temperature" },
  ],
  Tricks: [
    {
      name: "Climbing Practice",
      energyValue: -20,
      happinessValue: 10,
      hasLock: true,
    },
    {
      name: "Hand Approach",
      energyValue: -25,
      happinessValue: 15,
      hasLock: true,
    },
    { name: "Fetch", energyValue: -30, happinessValue: 20, tiertwotrick: true },
    {
      name: "Target Training",
      energyValue: -35,
      happinessValue: 25,
      tiertwotrick: true,
    },
  ],
  Shop: [
    { name: "Buy Crickets", cost: 5, isFood: true },
    { name: "Buy Mealworms", cost: 5, isFood: true },
    { name: "Purchase Branches", cost: 10, unlockstier2tricks: true },
  ],
  Earn: [
    { name: "Clean Room", cost: -20, cooldown: 5 },
    { name: "Do Homework", cost: -30, cooldown: 10 },
    { name: "Take a shower", cost: -45, cooldown: 15 },
    { name: "Do laundry", cost: -45, cooldown: 20 },
  ],
};
// generate numbers within a specified range
const randomNumberInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
// shape of game state context
interface GameState {
  coins: number;
  hydration: number;
  energy: number;
  hunger: number;
  happiness: number;
  health: number;
  temperature: number;
  trickt2unlocked: boolean;
  foodInventory: number;
  lockedActions: Set<string>;
  napUntil: number | null;
  cooldowns: Record<string, number>;
  tempChangeUntil: number | null;
  handleActionClick: (action: Action) => void;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
}
export const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { open } = useContext(ToastContext);
  // game state variables
  const [coins, setCoins] = useState(50);
  const [hydration, setHydration] = useState(randomNumberInRange(10, 40));
  const [energy, setEnergy] = useState(randomNumberInRange(10, 40));
  const [hunger, setHunger] = useState(randomNumberInRange(10, 40));
  const [happiness, setHappiness] = useState(randomNumberInRange(10, 40));
  const [health, setHealth] = useState(randomNumberInRange(10, 40));
  const [temperature, setTemperature] = useState(randomNumberInRange(60, 90));

  const [trickt2unlocked, setTrickt2unlocked] = useState(false);
  const [foodInventory, setFoodInventory] = useState(0);
  const [lockedActions, setLockedActions] = useState<Set<string>>(new Set());

  const [napUntil, setNapUntil] = useState<number | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [, setTick] = useState(0);
  const [tempChangeUntil, setTempChangeUntil] = useState<number | null>(null);
  // periodic effects to decrease stats and change temperature
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  // decrease stats every 2 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        const getDecrease = () => Math.floor(Math.random() * 6) + 10; // 10-15
        setHealth((h) => Math.max(0, h - getDecrease()));
        setHunger((h) => Math.max(0, h - getDecrease()));
        setHappiness((h) => Math.max(0, h - getDecrease()));
        setEnergy((e) => Math.max(0, e - getDecrease()));
      },
      2 * 60 * 1000,
    ); // 2 minutes

    return () => clearInterval(interval);
  }, []);
  // random temperature changes every 2 minutes
  useEffect(() => {
    const scheduleNextTempChange = () => {
      setTempChangeUntil(Date.now() + 2 * 60 * 1000);
    };

    const changeTempRandomly = () => {
      const changeAmount = randomNumberInRange(5, 20);
      const direction = Math.random() < 0.5 ? -1 : 1;
      setTemperature((t) =>
        Math.max(30, Math.min(150, t + changeAmount * direction)),
      );
      scheduleNextTempChange();
    };

    const checkAndChange = () => {
      if (tempChangeUntil === null) {
        scheduleNextTempChange();
      } else if (tempChangeUntil <= Date.now()) {
        changeTempRandomly();
      }
    };

    const interval = setInterval(checkAndChange, 1000);
    return () => clearInterval(interval);
  }, [tempChangeUntil]);
  // handle action clicks and update game state accordingly
  const handleActionClick = (action: Action) => {
    if (action.tiertwotrick === true && !trickt2unlocked) return;
    if (action.hasLock && lockedActions.has(action.name)) {
      open(<div>You've already done {action.name} today!</div>, 3000);
      return;
    }
    // check for cooldowns
    const napActive = napUntil !== null && napUntil > Date.now();
    const isShopOrEarn =
      actions.Shop.some((a) => a.name === action.name) ||
      actions.Earn.some((a) => a.name === action.name);
    if (napActive && !isShopOrEarn) {
      open(
        <div>Your chameleon is napping — wait until it wakes up.</div>,
        3000,
      );
      return;
    }
    // check if action is on cooldown
    if (action.healthValue) {
      if (health + action.healthValue > 100) {
        setHealth(100);
        setHappiness((h) => h - 5);
        open(
          <div>Health is at maximum! Your chameleon gets restless.</div>,
          3000,
        );
        return;
      } else {
        setHealth((h) => h + action.healthValue!);
      }
    }
    // handle food purchase
    if (action.isFood) {
      if (action.cost) setCoins((c) => c - action.cost!);
      setFoodInventory((f) => f + 1);
      open(
        <div>
          You have purchased food! You now have {foodInventory + 1} food items.
        </div>,
        3000,
      );
      return;
    }
    // handle feeding action
    if (action.hungerValue) {
      if (foodInventory >= 1) {
        if (hunger + action.hungerValue > 100) {
          setHealth((h) => h - 5);
          setHunger(100);
          open(<div>Your chameleon is full and cannot eat more!</div>, 3000);
          setFoodInventory((f) => f - 1);
          return;
        } else {
          setHunger((h) => h + action.hungerValue!);
          setFoodInventory((f) => f - 1);
        }
      } else {
        open(<div>No food available in inventory!</div>, 3000);
      }
    }
    // handle unlocking tier 2 tricks
    if (action.unlockstier2tricks) {
      setTrickt2unlocked(true);
      open(<div>Tier 2 Tricks Unlocked!</div>, 3000);
    }
    //
    if (action.name === "Nap" && action.cooldown) {
      setNapUntil(Date.now() + action.cooldown * 60 * 1000);
      open(
        <div>Your chameleon is now napping for {action.cooldown} minutes.</div>,
        3000,
      );
    }
    //
    if (action.energyValue) {
      if (energy + action.energyValue > 100) {
        setEnergy(100);
        open(<div>Energy is at maximum!</div>, 3000);
        return;
      } else if (energy + action.energyValue < 0) {
        setEnergy(0);
        open(<div>Your chameleon is too tired!</div>, 3000);
        return;
      } else {
        setEnergy((e) => e + action.energyValue!);
      }
    }
    //
    if (action.happinessValue) {
      if (happiness + action.happinessValue > 100) {
        setHappiness(100);
      } else {
        setHappiness((h) => h + action.happinessValue!);
      }
    }
    //hydration handling
    if (action.hydrationValue) {
      if (hydration + action.hydrationValue > 100) {
        setHydration(100);
        open(<div>Your chameleon is not thirsty.</div>, 3000);
        return;
      } else {
        setHydration((h) => h + action.hydrationValue!);
      }
    }
    // coin handling
    if (action.cost) {
      setCoins((c) => c - action.cost!);
      const audio = new Audio(dingSound);
      audio.play();
    }

    if (action.cooldown) {
      setCooldowns((prev) => ({
        ...prev,
        [action.name]: Date.now() + action.cooldown! * 60 * 1000,
      }));
    }

    if (action.hasLock) {
      setLockedActions((prev) => new Set(prev).add(action.name));
    }
  };

  const value = {
    coins,
    hydration,
    energy,
    hunger,
    happiness,
    health,
    temperature,
    trickt2unlocked,
    foodInventory,
    lockedActions,
    napUntil,
    cooldowns,
    tempChangeUntil,
    handleActionClick,
    setTemperature,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
// Custom hook for safely consuming GameContext
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
