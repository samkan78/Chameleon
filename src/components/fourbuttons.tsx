// FourButtons.tsx - Main game engine that handles all pet actions and stats
import { useState, useContext, useEffect } from "react";
import "./fourbuttons.css";
import dingSound from "../assets/ding.mp3";
import HealthBars from "./healthbars";
import ToastContext from "./ToastService";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";


// Import all chameleon sprites for the three species at different levels and moods
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

import NoseHornedChameleonGreen from "../assets/chameleons/nose-horned-green.png";
import NoseHornedChameleonYellow from "../assets/chameleons/nose-horned-yellow.png";
import NoseHornedChameleonBrown from "../assets/chameleons/nose-horned-brown.png";
import NoseHornedChameleonOrange from "../assets/chameleons/nose-horned-green-orange.png";

// TypeScript types for the five action categories
type Category = "Health" | "Care" | "Tricks" | "Shop" | "Earn";

// Action type defines what each button does (costs, stat changes, special properties)
type Action = {
  name: string;
  cost?: number; // Coins needed (negative means you earn coins)
  energyValue?: number;
  hungerValue?: number;
  hydrationValue?: number;
  happinessValue?: number;
  healthValue?: number;
  hasFood?: boolean; // Requires food in inventory
  hasLock?: boolean; // Can only be done once per day
  cooldown?: number; // Minutes before action can be used again
  unlockstier2tricks?: boolean; // Unlocks advanced tricks
  tiertwotrick?: boolean; // Locked until tier 2 is unlocked
  isFood?: boolean; // Adds to food inventory
  popuptest?: boolean;
};

// Overall game state type for saving/loading
type GameState = {
  coins: number;
  hydration: number;
  energy: number;
  hunger: number;
  happiness: number;
  health: number;
  level: number;
  foodInventory: number;
  trickt2unlocked: boolean;
  unlockedEarnSpots: number;
  actionsState: Record<Category, Action[]>;
};



// Starting stats - all begin at 50%
const hydrationStartLevel = 50;
const energyStartLevel = 50;
const hungerStartLevel = 50;
const happinessStartLevel = 50;
const healthStartLevel = 50;

// All available actions organized by category
const actions: Record<Category, Action[]> = {
  Health: [
    { name: "Check Eyes", healthValue: 10, happinessValue: -10, cooldown: 1 },
    { name: "Trim Nails", healthValue: 5, happinessValue: -10, cooldown: 1.5 },
    {
      name: "Check Skin Shedding",
      healthValue: 15,
      happinessValue: -10,
      cooldown: 5,
    },
    {
      name: "Clean Enclosure",
      healthValue: 10,
      happinessValue: -10,
      cooldown: 3,
    },
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
    { name: "Play", happinessValue: 30 },
    { name: "Misting", hydrationValue: 20, cost: 4 },
    { name: "Feed", hungerValue: 15, hasFood: true },
    { name: "Nap", energyValue: 25, cooldown: 2 },
    // Dev testing actions to quickly adjust stats
    {
      name: "testing for the dev",
      energyValue: 10,
      hungerValue: 10,
      hydrationValue: 10,
      healthValue: 10,
      happinessValue: 10,
    },
    {
      name: "testing for dev 2",
      energyValue: -10,
      hungerValue: -10,
      healthValue: -10,
      happinessValue: -10,
    },
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

// Props passed from parent component
type FourButtonsProps = {
  petType: string;
  userId?: string | null;
  saveGameData?: (id: string) => void;
  setWinLose?: (val: string) => void;
  setOpenModal?: (open: boolean) => void;
  onStatsChange?: (level: number, coins: number, foodInventory: number) => void;
};

const FourButtons = ({
  petType,
  userId,
  saveGameData,
  setWinLose,
  setOpenModal,
  onStatsChange,
}: FourButtonsProps) => {
  // Toast context for showing popup notifications
  const { open } = useContext(ToastContext);

  // Track which category is currently open (Health, Care, etc.)
  const [active, setActive] = useState<Category | null>(null);

  // Core game stats tracked with useState
  const [coins, setCoins] = useState(50);
  const [hydration, setHydration] = useState(hydrationStartLevel);
  const [energy, setEnergy] = useState(energyStartLevel);
  const [hunger, setHunger] = useState(hungerStartLevel);
  const [happiness, setHappiness] = useState(happinessStartLevel);
  const [health, setHealth] = useState(healthStartLevel);

  // Special game states
  const [trickt2unlocked, setTrickt2unlocked] = useState(false); // Has player bought branches?
  const [foodInventory, setFoodInventory] = useState(0); // Food items in inventory
  const [lockedActions, setLockedActions] = useState<Set<string>>(new Set()); // Daily-locked actions
  const [napUntil, setNapUntil] = useState<number | null>(null); // When nap ends
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({}); // Action cooldown timers
  const [, setTick] = useState(0); // Forces re-render every second for countdown timers
  const [level, setLevel] = useState(1); // Current evolution level (1-3)
  const [unlockedEarnSpots, setUnlockedEarnSpots] = useState(5); // How many custom earn actions allowed
  const [actionsState, setActionsState] =
    useState<Record<Category, Action[]>>(actions); // Dynamic action list

  // Modal state for creating custom earn actions
  const [showAddEarnModal, setShowAddEarnModal] = useState(false);
  const [earnName, setEarnName] = useState("");
  const [earnReward, setEarnReward] = useState("");
  
  // Function to get the current game state for saving
  const getGameState = (): GameState => {
  return {
    coins,
    hydration,
    energy,
    hunger,
    happiness,
    health,
    level,
    foodInventory,
    trickt2unlocked,
    unlockedEarnSpots,
    actionsState,
  };
  };

  // Function to save game state to Firebase
  const saveGameToFirebase = async () => {
  if (!userId) return;

  const gameState = getGameState(); // Grab all current stats

  try {
    await setDoc(
      doc(db, "users", userId),
      {
        gameState,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    // Toast notification
    open(
      <div className="bg-green-500 text-white px-4 py-3 rounded-lg">
        Game saved to cloud ☁️
      </div>,
      2000
    );

    // ✅ LOG
    console.log("✅ Game saved to Firebase:", gameState);
  } catch (err) {
    console.error("❌ Save failed:", err);
  }
};



  useEffect(() => {
  if (!userId) return;

  const loadGame = async () => {
    try {
      const snap = await getDoc(doc(db, "users", userId));
      if (!snap.exists()) return;

      const data = snap.data().gameState as GameState | undefined;
      if (!data) return;

      setCoins(data.coins);
      setHydration(data.hydration);
      setEnergy(data.energy);
      setHunger(data.hunger);
      setHappiness(data.happiness);
      setHealth(data.health);
      setLevel(data.level);
      setFoodInventory(data.foodInventory);
      setTrickt2unlocked(data.trickt2unlocked);
      setUnlockedEarnSpots(data.unlockedEarnSpots);
      setActionsState(data.actionsState);
    } catch (err) {
      console.error("Failed to load save", err);
    }
  };

  loadGame();
}, [userId]);


  // Timer that ticks every second to update cooldown displays
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Level-up logic: checks if enough stats are above 90% to evolve
  useEffect(() => {
    const stats = [energy, hunger, hydration, happiness, health];
    const statsAbove90 = stats.filter((stat) => stat > 90).length;
    const requiredStats = level + 1; // Level 1 needs 2 stats, Level 2 needs 3, etc.

    if (statsAbove90 >= requiredStats) {
      const newLevel = level + 1;

      // Win condition: reaching level 4 (after level 3)
      if (level === 3) {
        setWinLose?.("WIN");
        setOpenModal?.(true);
        if (userId && saveGameData) saveGameData(userId);
      }

      // Level up: increase level, unlock more earn slots, reset all stats to 50
      setLevel(newLevel);
      setUnlockedEarnSpots(newLevel + 4);
      setEnergy(50);
      setHunger(50);
      setHydration(50);
      setHappiness(50);
      setHealth(50);

      // Show celebration toast
      open(
        <div className="bg-purple-500 text-white px-4 py-3 rounded-lg shadow-lg font-bold">
          LEVEL UP! You're now Level {newLevel}!
          <br />
          Stats reset to 50. Unlocked {newLevel + 4} Earn action slots!
        </div>,
        4000,
      );
    }
  }, [
    energy,
    hunger,
    hydration,
    happiness,
    health,
    level,
    open,
    userId,
    saveGameData,
    setWinLose,
    setOpenModal,
  ]);

  // Send current stats back to parent component whenever they change
  useEffect(() => {
  onStatsChange?.(level, coins, foodInventory);
}, [level, coins, foodInventory]);


  // Image mappings for Panther Chameleon at each level
  const pantherImages = {
    1: {
      happy: Level_1_PantherChameleonHappy,
      normal: Level_1_PantherChameleonNormal,
    },
    2: {
      happy: Level_2_PantherChameleonHappy,
      normal: Level_2_PantherChameleonNormal,
    },
    3: {
      happy: Level_3_PantherChameleonHappy,
      normal: Level_3_PantherChameleonNormal,
    },
  };

  // Image mappings for Jackson's Chameleon at each level
  const jacksonsImages = {
    1: {
      happy: Level_1_JacksonsChameleonHappy,
      normal: Level_1_JacksonsChameleonNormal,
    },
    2: {
      happy: Level_2_JacksonsChameleonHappy,
      normal: Level_2_JacksonsChameleonNormal,
    },
    3: {
      happy: Level_3_JacksonsChameleonHappy,
      normal: Level_3_JacksonsChameleonNormal,
    },
  };

  // Nose-Horned has all 4 moods but no level variations
  const noseHornedImages = {
    happy: NoseHornedChameleonYellow,
    normal: NoseHornedChameleonGreen,
    sick: NoseHornedChameleonBrown,
    angry: NoseHornedChameleonOrange,
  };

  type Mood = "happy" | "normal" | "sick" | "angry";
  type ImageLevel = 1 | 2 | 3;

  // Determine chameleon's current mood based on stats
  const getMood = (): Mood => {
    if (happiness >= 90) return "happy";
    if (health <= 30 || energy <= 30) return "sick";
    if (hunger <= 30 || hydration <= 30) return "angry";
    return "normal";
  };

  // Get the correct image based on species, level, and current mood
  const getImagePath = () => {
    const mood = getMood();
    const safeLevel = Math.min(level, 3) as ImageLevel;

    if (petType === "Panther Chameleon") {
      // Panther only has happy/normal images, so map sick/angry to normal
      return pantherImages[safeLevel][
        mood === "sick" || mood === "angry" ? "normal" : mood
      ];
    } else if (petType === "Jackson's Chameleon") {
      return jacksonsImages[safeLevel][
        mood === "sick" || mood === "angry" ? "normal" : mood
      ];
    } else if (petType === "Nose-Horned Chameleon") {
      // Nose-Horned has all 4 mood images
      return noseHornedImages[mood];
    }
    return "";
  };

  // Opens or closes a category when clicked
  const toggleCategory = (category: Category) =>
    setActive(active === category ? null : category);

  // Main action handler - processes clicks on sub-action buttons
  const handleActionClick = (action: Action) => {
    // Block tier 2 tricks if branches haven't been purchased
    if (action.tiertwotrick === true && !trickt2unlocked) return;

    // Check if this daily action has already been used
    if (action.hasLock && lockedActions.has(action.name)) {
      open(
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          You've already done {action.name} today!
        </div>,
        3000,
      );
      return;
    }

    // Block most actions during nap time (except shop and earn)
    const napActive = napUntil !== null && napUntil > Date.now();
    const isShopOrEarn =
      actionsState.Shop.some((a) => a.name === action.name) ||
      actionsState.Earn.some((a) => a.name === action.name);

    if (napActive && !isShopOrEarn) {
      open(
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          Your chameleon is napping!
        </div>,
        3000,
      );
      return;
    }

    // Handle coin transactions (spending or earning)
    if (action.cost !== undefined) {
      if (coins - action.cost < 0) {
        setCoins(0);
        open(
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
            No money left!
          </div>,
          3000,
        );
        return;
      } else {
        setCoins(coins - action.cost);
        new Audio(dingSound).play(); // Play sound when coins change
      }
    }

    // Update health stat (prevent going over 100)
    if (action.healthValue !== undefined) {
      if (health + action.healthValue > 100) {
        setHealth(100);
        open(
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
            Health is at maximum!
          </div>,
          3000,
        );
        return;
      } else {
        setHealth(Math.max(0, health + action.healthValue));
      }
    }

    // Buying food adds to inventory
    if (action.isFood) {
      if (action.cost !== undefined) {
        setCoins(coins - action.cost);
        setFoodInventory(foodInventory + 1);
        open(
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
            Food purchased!
          </div>,
          3000,
        );
        return;
      }
    }

    // Feeding requires food in inventory
    if (action.hungerValue !== undefined) {
      if (foodInventory >= 1) {
        setHunger(Math.min(100, hunger + action.hungerValue));
        setFoodInventory(foodInventory - 1);
      } else {
        open(
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
            No food in inventory!
          </div>,
          3000,
        );
      }
    }

    // Unlock advanced tricks permanently
    if (action.unlockstier2tricks) {
      setTrickt2unlocked(true);
      open(
        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
          Tier 2 Tricks Unlocked!
        </div>,
        3000,
      );
    }

    // Start nap timer (blocks other actions)
    if (action.name === "Nap" && action.cooldown !== undefined) {
      setNapUntil(Date.now() + action.cooldown * 60 * 1000);
      open(
        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
          Chameleon napping for {action.cooldown} minutes.
        </div>,
        3000,
      );
    }

    // Update happiness (keep between 0-100)
    if (action.happinessValue !== undefined) {
      setHappiness(
        Math.max(0, Math.min(100, happiness + action.happinessValue)),
      );
    }

    // Update energy with bounds checking
    if (action.energyValue !== undefined) {
      const newEnergy = energy + action.energyValue;
      if (newEnergy > 100) {
        setEnergy(100);
        open(
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
            Energy is at maximum!
          </div>,
          3000,
        );
        return;
      } else if (newEnergy < 0) {
        open(
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
            Too tired!
          </div>,
          3000,
        );
        return;
      } else {
        setEnergy(newEnergy);
      }
    }

    // Update hydration (keep between 0-100)
    if (action.hydrationValue !== undefined) {
      setHydration(
        Math.max(0, Math.min(100, hydration + action.hydrationValue)),
      );
    }

    // Start cooldown timer for this action
    if (action.cooldown !== undefined) {
      const cooldownMs = action.cooldown * 60 * 1000;
      setCooldowns((prev: Record<string, number>) => ({
        ...prev,
        [action.name]: Date.now() + cooldownMs,
      }));
    }

    // Lock daily actions so they can't be repeated
    if (action.hasLock) {
      setLockedActions((prev) => new Set(prev).add(action.name));
    }
  };

  // Convert milliseconds to MM:SS format for countdown display
  const formatMs = (ms: number) => {
    const total = Math.ceil(ms / 1000);
    return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;
  };

  // Main render - left panel shows chameleon, right panel shows stats and buttons
  return (
    <>
    

    <div className="four-buttons-wrapper">
      {/* Left side: animated chameleon image */}
      <div className="left-panel">
        <img src={getImagePath()} alt="Chameleon" className="chameleon-image" />
      </div>

      {/* Right side: health bars and action buttons */}
      <div className="right-panel">
        <HealthBars
          energy={energy}
          hunger={hunger}
          happiness={happiness}
          health={health}
          hydration={hydration}
        />

        {/* Category buttons (Health, Care, Tricks, Shop, Earn) */}
        <div className="main-buttons">
          {(Object.keys(actionsState) as Category[]).map((category) => {
            // Each category gets its own color
            const categoryColors: Record<Category, string> = {
              Health: "#FF6B6B",
              Care: "#4ECDC4",
              Tricks: "#FFE66D",
              Shop: "#95E1D3",
              Earn: "#C7CEEA",
            };

            return (
              <button
                key={category}
                className={`main-btn ${active === category ? "active" : ""}`}
                onClick={() => toggleCategory(category)}
                style={{
                  backgroundColor:
                    active === category ? categoryColors[category] : "#1a1a1a",
                  color: active === category ? "#000" : "#fff",
                  borderColor: categoryColors[category],
                }}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Sub-action buttons appear when a category is selected */}
        {active && (
          <div className="sub-buttons">
            {actionsState[active].map((action) => {
              // Calculate remaining cooldown time
              const cooldownEnd = cooldowns[action.name] ?? 0;
              const cooldownRemaining = Math.max(0, cooldownEnd - Date.now());
              const disabled = cooldownRemaining > 0;

              return (
                
                <button
                  key={action.name}
                  className="sub-btn"
                  disabled={disabled}
                  onClick={() => handleActionClick(action)}
                >
                  {action.name}
                  {action.cost !== undefined && ` — $${Math.abs(action.cost)}`}
                  {cooldownRemaining > 0 && ` — ${formatMs(cooldownRemaining)}`}
                </button>
              );
            })}

            {/* Special button to create custom earn actions */}
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

        {/* Modal for creating custom earn actions */}
        {showAddEarnModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <div
              style={{
                background: "white",
                padding: 28,
                borderRadius: 12,
                width: 360,
                textAlign: "center",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  margin: "0 0 20px 0",
                }}
              >
                Add Earn Action
              </h2>

              <div style={{ marginTop: 15, textAlign: "left" }}>
                {/* Input for action name */}
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: "600",
                    color: "#222",
                    fontSize: "0.95rem",
                  }}
                >
                  Action Name
                </label>
                <input
                  type="text"
                  value={earnName}
                  onChange={(e) => setEarnName(e.target.value)}
                  placeholder="e.g., Wash Dishes"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "6px",
                    boxSizing: "border-box",
                    marginBottom: 16,
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#333")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />

                {/* Input for coin reward (capped at 30) */}
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: "600",
                    color: "#222",
                    fontSize: "0.95rem",
                  }}
                >
                  Reward ($)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={earnReward}
                  onChange={(e) => {
                    const val = e.target.value;
                    const numericVal = val.replace(/[^0-9]/g, ""); // Strip non-digits
                    const cappedVal =
                      numericVal === ""
                        ? ""
                        : Math.min(Number(numericVal), 30).toString(); // Max 30 coins
                    setEarnReward(cappedVal);
                  }}
                  placeholder="e.g., 25"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "6px",
                    boxSizing: "border-box",
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#333")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
              </div>
              
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                }}
              >
                {/* Add button - validates input and creates the new action */}
                <button
                  onClick={() => {
                    // Validation checks
                    if (!earnName.trim()) {
                      open(
                        <div className="bg-red-500 text-white px-4 py-3 rounded-lg">
                          Action name cannot be empty
                        </div>,
                        3000,
                      );
                      return;
                    }
                    if (!earnReward.trim()) {
                      open(
                        <div className="bg-red-500 text-white px-4 py-3 rounded-lg">
                          Reward cannot be empty
                        </div>,
                        3000,
                      );
                      return;
                    }
                    const reward = Number(earnReward);
                    if (Number.isNaN(reward) || reward <= 0) {
                      open(
                        <div className="bg-red-500 text-white px-4 py-3 rounded-lg">
                          Invalid reward number (must be positive)
                        </div>,
                        3000,
                      );
                      return;
                    }

                    // Enforce max reward of 30 coins
                    const cappedReward = Math.min(reward, 30);
                    if (reward > 30) {
                      open(
                        <div className="bg-yellow-500 text-white px-4 py-3 rounded-lg">
                          Reward capped at 30
                        </div>,
                        2000,
                      );
                    }

                    // Check if player has unlocked enough earn slots
                    if (actionsState.Earn.length >= unlockedEarnSpots) {
                      open(
                        <div className="bg-red-500 text-white px-4 py-3 rounded-lg">
                          No unlocked Earn slots
                        </div>,
                        3000,
                      );
                      return;
                    }

                    // Create and add the new custom earn action
                    const newAction: Action = {
                      name: earnName,
                      cost: -Math.abs(cappedReward), // Negative cost means earning
                      cooldown: 10,
                    };
                    setActionsState((prev) => ({
                      ...prev,
                      Earn: [...prev.Earn, newAction],
                    }));

                    // Show success message and close modal
                    open(
                      <div className="bg-green-500 text-white px-4 py-3 rounded-lg">
                        Earn action "{earnName}" added!
                      </div>,
                      3000,
                    );
                    setShowAddEarnModal(false);
                    setEarnName("");
                    setEarnReward("");
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    flex: 1,
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#218838";
                    e.currentTarget.style.boxShadow =
                      "0 4px 10px rgba(0, 0, 0, 0.15)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#28a745";
                    e.currentTarget.style.boxShadow =
                      "0 2px 6px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Add
                </button>

                {/* Cancel button - closes modal without saving */}
                <button
                  onClick={() => {
                    setShowAddEarnModal(false);
                    setEarnName("");
                    setEarnReward("");
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    border: "2px solid #ddd",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    flex: 1,
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e0e0e0";
                    e.currentTarget.style.boxShadow =
                      "0 4px 10px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                    e.currentTarget.style.boxShadow =
                      "0 2px 6px rgba(0, 0, 0, 0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <button
    onClick={saveGameToFirebase}
    style={{
    position: "fixed",
    top: 12,
    right: 12,
    zIndex: 3000,
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "white",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  }}
  >
    Save
  </button>
    </>
  );
};

export default FourButtons;
