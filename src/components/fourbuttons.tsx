// FourButtons.tsx
import { useState, useContext } from "react";
import "./fourbuttons.css";
import dingSound from "../assets/ding.mp3";
import HealthBars from "./healthbars";
import ToastContext from "./ToastService";

//chameleon images
import Level_1_PantherChameleonHappy from "../assets/chameleonImages/Panther Chameleon/Level 1/Panther Chameleon Level 1 YELLOW.png";
import Level_1_PantherChameleonNormal from "../assets/chameleonImages/Panther Chameleon/Level 1/Panther Chameleon Level 1 GREEN.png";
import Level_2_PantherChameleonHappy from "../assets/chameleonImages/Panther Chameleon/Level 2/Panther Chameleon YELLOW.png";
import Level_2_PantherChameleonNormal from "../assets/chameleonImages/Panther Chameleon/Level 2/Panther Chameleon GREEN.png";
import Level_3_PantherChameleonHappy from "../assets/chameleonImages/Panther Chameleon/Level 3/Panther Chameleon Level 3 YELLOW.png";
import Level_3_PantherChameleonNormal from "../assets/chameleonImages/Panther Chameleon/Level 3/Panther Chameleon Level 3 GREEN.png";

import Level_1_JacksonsChameleonHappy from "../assets/chameleonImages/Jackson's Chameleon/Level 1/Jackson's Chameleon Level 1 YELLOW.png";
import Level_1_JacksonsChameleonNormal from "../assets/chameleonImages/Jackson's Chameleon/Level 1/Jackson's Chameleon Level 1 GREEN.png";
import Level_2_JacksonsChameleonHappy from "../assets/chameleonImages/Jackson's Chameleon/Level 2/Jackson's Chameleon Level 2 YELLOW.png";
import Level_2_JacksonsChameleonNormal from "../assets/chameleonImages/Jackson's Chameleon/Level 2/Jackson's Chameleon Level 2 GREEN.png";
import Level_3_JacksonsChameleonHappy from "../assets/chameleonImages/Jackson's Chameleon/Level 3/Jackson's Chameleon Level 3 YELLOW.png";
import Level_3_JacksonsChameleonNormal from "../assets/chameleonImages/Jackson's Chameleon/Level 3/Jackson's Chameleon Level 3 GREEN.png";

// ---------------------------
// defining categories and actions
// ---------------------------
type Category = "Health" | "Care" | "Tricks" | "Shop" | "Earn";

type Action = {
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

// ---------------------------
// subbutton actions
// ---------------------------
const actions: Record<Category, Action[]> = {
  Health: [
    { name: "Check Eyes", healthValue: 10, happinessValue: -10, cooldown: 1 },
    { name: "Trim Nails", healthValue: 5, happinessValue: -10, cooldown: 1.5 },
    { name: "Check Skin Shedding", healthValue: 15, happinessValue: -10, cooldown: 5 },
    { name: "Clean Enclosure", healthValue: 10, happinessValue: -10, cooldown: 3 },
    { name: "Vet Visit", cost: 75, healthValue: 50, happinessValue: -25, hydrationValue: 30, energyValue: -10, hungerValue: 30 },
  ],
  Care: [
    { name: "Play", happinessValue: 30 },
    { name: "Misting", hydrationValue: 20, cost: 4 },
    { name: "Feed", hungerValue: 15, hasFood: true },
    { name: "Nap", energyValue: 25, cooldown: 2 }
    
  ],
  Tricks: [
    { name: "Climbing Practice", energyValue: -20, happinessValue: 10, hasLock: true },
    { name: "Hand Approach", energyValue: -25, happinessValue: 15, hasLock: true },
    { name: "Fetch", energyValue: -30, happinessValue: 20, tiertwotrick: true },
    { name: "Target Training", energyValue: -35, happinessValue: 25, tiertwotrick: true },
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

// ---------------------------
// coins/monetary display component
// ---------------------------
const Money = ({ coins }: { coins: number }) => (
  <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
    <button style={{ width: 80, height: 40, backgroundColor: "black", color: "white", borderRadius: 5, border: "none", fontWeight: "bold" }} disabled>
      Coins: {coins}
    </button>
  </div>
);

const FoodInventory = ({ foodInventory }: { foodInventory: number }) => (
  <div style={{ position: "fixed", top: 60, right: 10, zIndex: 1000 }}>
    <button style={{ width: 120, height: 40, backgroundColor: "brown", color: "white", borderRadius: 5, border: "none", fontWeight: "bold" }} disabled>
      Food Items: {foodInventory}
    </button>
  </div>
);

const LevelDisplay = ({ level }: { level: number }) => (
  <div style={{ position: "fixed", top: 110, right: 10, zIndex: 1000 }}>
    <h1>Level: {level}</h1>
  </div>
);

//---------------------------
// random variable function
//---------------------------
const randomNumberInRange = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

//---------------------------
// starting levels
//---------------------------
const hydrationStartLevel = randomNumberInRange(30, 60);
const energyStartLevel = randomNumberInRange(30, 60);
const hungerStartLevel = randomNumberInRange(30, 60);
const happinessStartLevel = randomNumberInRange(30, 60);
const healthStartLevel = randomNumberInRange(30, 60);
const temperatureStart = randomNumberInRange(60, 90);

// ---------------------------
// main component
// ---------------------------
const FourButtons = ({ petType }: { petType: string }) => {
  const { open } = useContext(ToastContext);

  const [active, setActive] = useState<Category | null>(null);
  const [coins, setCoins] = useState(50);
  const [hydration, setHydration] = useState(hydrationStartLevel);
  const [energy, setEnergy] = useState(energyStartLevel);
  const [hunger, setHunger] = useState(hungerStartLevel);
  const [happiness, setHappiness] = useState(happinessStartLevel);
  const [health, setHealth] = useState(healthStartLevel);
  const [temperature, setTemperature] = useState(temperatureStart);
  const [trickt2unlocked, setTrickt2unlocked] = useState(false);
  const [foodInventory, setFoodInventory] = useState(0);
  const [lockedActions, setLockedActions] = useState<Set<string>>(new Set());
  const [napUntil, setNapUntil] = useState<number | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [level] = useState(1);

  const pantherImages = {
    1: { happy: Level_1_PantherChameleonHappy, normal: Level_1_PantherChameleonNormal },
    2: { happy: Level_2_PantherChameleonHappy, normal: Level_2_PantherChameleonNormal },
    3: { happy: Level_3_PantherChameleonHappy, normal: Level_3_PantherChameleonNormal },
  };

  const jacksonsImages = {
    1: { happy: Level_1_JacksonsChameleonHappy, normal: Level_1_JacksonsChameleonNormal },
    2: { happy: Level_2_JacksonsChameleonHappy, normal: Level_2_JacksonsChameleonNormal },
    3: { happy: Level_3_JacksonsChameleonHappy, normal: Level_3_JacksonsChameleonNormal },
  };

  type Mood = "happy" | "normal";
  type ImageLevel = 1 | 2 | 3;

  const getMood = (): Mood => {
    if (happiness >= 90) return "happy";
    return "normal";
  };

  const getImagePath = () => {
    const mood = getMood();
    const safeLevel = Math.min(level, 3) as ImageLevel;

    if (petType === "Panther Chameleon") {
      return pantherImages[safeLevel][mood];
    } else if (petType === "Jackson's Chameleon") {
      return jacksonsImages[safeLevel][mood];
    }
    return "";
  };

  // Toggle main category
  const toggleCategory = (category: Category) => setActive(active === category ? null : category);

  //---------------------------
  // handle clicking a sub-action
  //---------------------------
  const handleActionClick = (action: Action) => {
    if (action.tiertwotrick === true && !trickt2unlocked) return;

    if (action.hasLock && lockedActions.has(action.name)) {
      open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">You've already done {action.name} today!</div>, 3000);
      return;
    }

    const napActive = napUntil !== null && napUntil > Date.now();
    const isShopOrEarn = actions.Shop.some((a) => a.name === action.name) || actions.Earn.some((a) => a.name === action.name);

    if (napActive && !isShopOrEarn) {
      open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is napping!</div>, 3000);
      return;
    }
    
    // ----- COINS -----
    if (action.cost !== undefined) {
      if (coins - action.cost < 0){
        setCoins(0);
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">No money left!</div>, 3000);
        return;
      } else {
        setCoins(coins - action.cost);
        new Audio(dingSound).play();
      }
    }

    // ----- HEALTH -----
    if (action.healthValue !== undefined) {
      if (health + action.healthValue > 100) {
        setHealth(100);
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Health is at maximum!</div>, 3000);
        return;
      } else {
        setHealth(Math.max(0, health + action.healthValue));
      }
    }

    // ----- FOOD -----
    if (action.isFood) {
      if (action.cost !== undefined){
        setCoins(coins - action.cost);
        setFoodInventory(foodInventory + 1);
        open(<div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">Food purchased!</div>, 3000);
        return;
      }
    }

    if (action.hungerValue !== undefined) {
      if (foodInventory >= 1) {
        setHunger(Math.min(100, hunger + action.hungerValue));
        setFoodInventory(foodInventory - 1);
      } else {
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">No food in inventory!</div>, 3000);
      }
    }

    // ----- TIER 2 TRICKS -----
    if (action.unlockstier2tricks) {
      setTrickt2unlocked(true);
      open(<div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">Tier 2 Tricks Unlocked!</div>, 3000);
    }

    // ----- NAP -----
    if (action.name === "Nap" && action.cooldown !== undefined) {
      setNapUntil(Date.now() + action.cooldown * 60 * 1000);
      open(<div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">Chameleon napping for {action.cooldown} minutes.</div>, 3000);
    }

    // ----- HAPPINESS -----
    if (action.happinessValue !== undefined) {
      setHappiness(Math.max(0, Math.min(100, happiness + action.happinessValue)));
    }

    // ----- ENERGY -----
    if (action.energyValue !== undefined) {
      const newEnergy = energy + action.energyValue;
      if (newEnergy > 100) {
        setEnergy(100);
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Energy is at maximum!</div>, 3000);
        return;
      } else if (newEnergy < 0) {
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Too tired!</div>, 3000);
        return;
      } else {
        setEnergy(newEnergy);
      }
    }

    // ----- HYDRATION -----
    if (action.hydrationValue !== undefined) {
      setHydration(Math.max(0, Math.min(100, hydration + action.hydrationValue)));
    }

    // ----- COOLDOWNS -----
    if (action.cooldown !== undefined){
      const cooldownMs = action.cooldown * 60 * 1000;
      setCooldowns(prev => ({ ...prev, [action.name]: Date.now() + cooldownMs }));
    }

    // ----- LOCKED ACTIONS -----
    if (action.hasLock){
      setLockedActions(prev => new Set(prev).add(action.name));
    }
  };

  //---------------------------
  // Render
  //---------------------------
  return (
    <div className="four-buttons-wrapper">
      <div className="left-panel">
        <img src={getImagePath()} alt="Chameleon" className="chameleon-image" />
      </div>
      <Money coins={coins} />
      <FoodInventory foodInventory={foodInventory} />
      <LevelDisplay level={level} />

      <HealthBars 
        energy={energy} 
        hunger={hunger} 
        happiness={happiness} 
        health={health} 
        hydration={hydration} 
        temperature={temperature}
        onIncreaseTemp={() => setTemperature((t) => Math.min(150, t + 1))}
        onDecreaseTemp={() => setTemperature((t) => Math.max(30, t - 1))}
      />

      {/* Main buttons */}
      <div className="main-buttons">
        {(Object.keys(actions) as Category[]).map(category => (
          <button key={category} className={`main-btn ${active === category ? "active" : ""}`} onClick={() => toggleCategory(category)}>
            {category}
          </button>
        ))}
      </div>

      {/* Subbuttons */}
      {active && (
        <div className="sub-buttons">
          {actions[active].map(action => {
            const cooldownEnd = cooldowns[action.name] ?? 0;
            const cooldownRemaining = Math.max(0, cooldownEnd - Date.now());
            const disabled = cooldownRemaining > 0;
            const formatMs = (ms: number) => { const total = Math.ceil(ms/1000); return `${Math.floor(total/60)}:${(total%60).toString().padStart(2,"0")}`; };
            return (
              <button key={action.name} className="sub-btn" disabled={disabled} onClick={() => handleActionClick(action)}>
                {action.name} {action.cost !== undefined && `— $${Math.abs(action.cost)}`} {cooldownRemaining>0 && `— ${formatMs(cooldownRemaining)}`}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FourButtons;
