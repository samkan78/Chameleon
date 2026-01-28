// FourButtons.tsx
import { useState, useContext, useEffect } from "react";
import "./fourbuttons.css";
import dingSound from "../assets/ding.mp3";
import HealthBars from "./healthbars";
import ToastContext from "./ToastService";
import { Money } from "./money";
import { FoodInventory } from "./foodInventory";

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
  popuptest?: boolean;
};

// default starting stat levels
const hydrationStartLevel = 50;
const energyStartLevel = 50;
const hungerStartLevel = 50;
const happinessStartLevel = 50;
const healthStartLevel = 50;
const temperatureStart = 70;

// ---------------------------
// subbutton actions (initial)
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
    { name: "Nap", energyValue: 25, cooldown: 2 },
    { name: "testing for the dev", energyValue:10,hungerValue:10,hydrationValue:10,healthValue:10,happinessValue:10},
    { name: "testing for dev 2", energyValue: -10, hungerValue: -10, healthValue: -10, happinessValue: -10}
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
// (duplicate import block removed - original image imports are at file top)
// ---------------------------
// main component
// ---------------------------
type FourButtonsProps = {
  petType: string;
  userId?: string;
  saveGameData?: (id: string) => void;
  setWinLose?: (val: string) => void;
  setOpenModal?: (open: boolean) => void;
};

const FourButtons = ({ petType, userId, saveGameData, setWinLose, setOpenModal }: FourButtonsProps) => {
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
  const [level, setLevel] = useState(1);
  const [unlockedEarnSpots, setUnlockedEarnSpots] = useState(5);
  const [actionsState, setActionsState] = useState<Record<Category, Action[]>>(actions);
  const [showAddEarnModal, setShowAddEarnModal] = useState(false);
  const [earnName, setEarnName] = useState("");
  const [earnReward, setEarnReward] = useState("");

  useEffect(() => {
    const stats = [energy, hunger, hydration, happiness, health];
    const statsAbove90 = stats.filter((stat) => stat > 90).length;
    const requiredStats = level + 1;

    if (statsAbove90 >= requiredStats) {
      const newLevel = level + 1;
      // If reaching the game's win level, call parent callbacks if provided
      if (level === 3) {
        setWinLose?.('WIN');
        setOpenModal?.(true);
        if (userId && saveGameData) saveGameData(userId);
      }

      // Level up and reset all stats to 50
      setLevel(newLevel);
      setUnlockedEarnSpots(newLevel + 4);
      setEnergy(50);
      setHunger(50);
      setHydration(50);
      setHappiness(50);
      setHealth(50);

      open(
        <div className="bg-purple-500 text-white px-4 py-3 rounded-lg shadow-lg font-bold">
          LEVEL UP! You're now Level {newLevel}!
          <br />
          Stats reset to 50. Unlocked {newLevel + 4} Earn action slots!
        </div>,
        4000
      );
    }
  }, [energy, hunger, hydration, happiness, health, level, open, userId, saveGameData, setWinLose, setOpenModal]);

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

  // small level display component
  const LevelDisplay: React.FC<{ level: number }> = ({ level }) => (
    <div style={{ position: "fixed", top: 70, right: 10, zIndex: 1000 }}>
      <button style={{ width: 70, height: 30, backgroundColor: "#222", color: "white" }} disabled>
        Level: {level}
      </button>
    </div>
  );

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
    const isShopOrEarn = actionsState.Shop.some((a) => a.name === action.name) || actionsState.Earn.some((a) => a.name === action.name);

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
        {(Object.keys(actionsState) as Category[]).map(category => (
          <button key={category} className={`main-btn ${active === category ? "active" : ""}`} onClick={() => toggleCategory(category)}>
            {category}
          </button>
        ))}
      </div>

      {/* Subbuttons */}
      {active && (
        <div className="sub-buttons">
          {actionsState[active].map(action => {
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

          {/* Add Earn action UI when Earn is active */}
          {active === "Earn" && (
            <div style={{ marginTop: 12 }}>
              <button
                className="sub-btn"
                onClick={() => {
                  setShowAddEarnModal(true);
                  setEarnName("");
                  setEarnReward("");
                }}
              >
                + Add Earn Action
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Earn Action Modal */}
      {showAddEarnModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}>
          <div style={{
            background: "white",
            padding: 20,
            borderRadius: 8,
            width: 320,
            textAlign: "center",
          }}>
            <h2 className="text-lg font-black text-gray-800">Add Earn Action</h2>
            
            <div style={{ marginTop: 15, textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: 5, fontWeight: "bold", color: "#333" }}>
                Action Name
              </label>
              <input
                type="text"
                value={earnName}
                onChange={(e) => setEarnName(e.target.value)}
                placeholder="e.g., Wash Dishes"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                  marginBottom: 12,
                }}
              />

              <label style={{ display: "block", marginBottom: 5, fontWeight: "bold", color: "#333" }}>
                Reward ($)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={earnReward}
                onChange={(e) => {
                  const val = e.target.value;
                  // Only allow digits
                  const numericVal = val.replace(/[^0-9]/g, "");
                  // Cap at 30
                  const cappedVal = numericVal === "" ? "" : Math.min(Number(numericVal), 30).toString();
                  setEarnReward(cappedVal);
                }}
                placeholder="e.g., 25"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div className="flex gap-4" style={{ marginTop: 20 }}>
              <button
                onClick={() => {
                  if (!earnName.trim()) {
                    open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg">Action name cannot be empty</div>, 3000);
                    return;
                  }
                  if (!earnReward.trim()) {
                    open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg">Reward cannot be empty</div>, 3000);
                    return;
                  }
                  const reward = Number(earnReward);
                  if (Number.isNaN(reward) || reward <= 0) {
                    open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg">Invalid reward number (must be positive)</div>, 3000);
                    return;
                  }
                  // Cap reward at 30
                  const cappedReward = Math.min(reward, 30);
                  if (reward > 30) {
                    open(<div className="bg-yellow-500 text-white px-4 py-3 rounded-lg">Reward capped at 30</div>, 2000);
                  }
                  if (actionsState.Earn.length >= unlockedEarnSpots) {
                    open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg">No unlocked Earn slots</div>, 3000);
                    return;
                  }
                  const newAction: Action = { name: earnName, cost: -Math.abs(cappedReward), cooldown: 10 };
                  setActionsState(prev => ({ ...prev, Earn: [...prev.Earn, newAction] }));
                  open(<div className="bg-green-500 text-white px-4 py-3 rounded-lg">Earn action "{earnName}" added!</div>, 3000);
                  setShowAddEarnModal(false);
                  setEarnName("");
                  setEarnReward("");
                }}
                className="btn btn-success w-full"
                style={{ backgroundColor: "#28a745", color: "white" }}
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddEarnModal(false);
                  setEarnName("");
                  setEarnReward("");
                }}
                className="btn btn-light w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FourButtons;
