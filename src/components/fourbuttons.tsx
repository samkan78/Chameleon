// FourButtons.tsx
import React, { useState, useContext, useEffect } from "react";
import "./fourbuttons.css";
import dingSound from "../assets/ding.mp3";
import HealthBars from "./healthbars";
import ToastContext from "./ToastService";
import Modal from "./modal.tsx";
import { useRestart } from "./RestartContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

//chameleon images
import Level_1_PantherChameleonHappy from "../assets/chameleonImages/Panther Chameleon/Level 1/Panther Chameleon Level 1 YELLOW.png";
import Level_1_PantherChameleonSick from "../assets/chameleonImages/Panther Chameleon/Level 1/Panther Chameleon Level 1 GREY.png";
import Level_1_PantherChameleonNormal from "../assets/chameleonImages/Panther Chameleon/Level 1/Panther Chameleon Level 1 GREEN.png";
import Level_1_PantherChameleonAngry from "../assets/chameleonImages/Panther Chameleon/Level 1/Panther Chameleon Level 1 ORANGE-RED.png";
import Level_2_PantherChameleonHappy from "../assets/chameleonImages/Panther Chameleon/Level 2/Panther Chameleon YELLOW.png";
import Level_2_PantherChameleonSick from "../assets/chameleonImages/Panther Chameleon/Level 2/Panther Chameleon GREY.png";
import Level_2_PantherChameleonNormal from "../assets/chameleonImages/Panther Chameleon/Level 2/Panther Chameleon GREEN.png";
import Level_2_PantherChameleonAngry from "../assets/chameleonImages/Panther Chameleon/Level 2/Panther Chameleon ORANGE-RED.png";
import Level_3_PantherChameleonHappy from "../assets/chameleonImages/Panther Chameleon/Level 3/Panther Chameleon Level 3 YELLOW.png";
import Level_3_PantherChameleonSick from "../assets/chameleonImages/Panther Chameleon/Level 3/Panther Chameleon Level 3 GREY.png";
import Level_3_PantherChameleonNormal from "../assets/chameleonImages/Panther Chameleon/Level 3/Panther Chameleon Level 3 GREEN.png";
import Level_3_PantherChameleonAngry from "../assets/chameleonImages/Panther Chameleon/Level 3/Panther Chameleon Level 3 ORANGE-RED.png";

import Level_1_JacksonsChameleonHappy from "../assets/chameleonImages/Jackson's Chameleon/Level 1/Jackson's Chameleon Level 1 YELLOW.png";
import Level_1_JacksonsChameleonSick from "../assets/chameleonImages/Jackson's Chameleon/Level 1/Jackson's Chameleon Level 1 GREY.png";
import Level_1_JacksonsChameleonNormal from "../assets/chameleonImages/Jackson's Chameleon/Level 1/Jackson's Chameleon Level 1 GREEN.png";
import Level_1_JacksonsChameleonAngry from "../assets/chameleonImages/Jackson's Chameleon/Level 1/Jackson's Chameleon Level 1 ORANGE-RED.png";
import Level_2_JacksonsChameleonHappy from "../assets/chameleonImages/Jackson's Chameleon/Level 2/Jackson's Chameleon Level 2 YELLOW.png";
import Level_2_JacksonsChameleonSick from "../assets/chameleonImages/Jackson's Chameleon/Level 2/Jackson's Chameleon Level 2 GREY.png";
import Level_2_JacksonsChameleonNormal from "../assets/chameleonImages/Jackson's Chameleon/Level 2/Jackson's Chameleon Level 2 GREEN.png";
import Level_2_JacksonsChameleonAngry from "../assets/chameleonImages/Jackson's Chameleon/Level 2/Jackson's Chameleon Level 2 ORANGE-RED.png";
import Level_3_JacksonsChameleonHappy from "../assets/chameleonImages/Jackson's Chameleon/Level 3/Jackson's Chameleon Level 3 YELLOW.png";
import Level_3_JacksonsChameleonSick from "../assets/chameleonImages/Jackson's Chameleon/Level 3/Jackson's Chameleon Level 3 GREY.png";
import Level_3_JacksonsChameleonNormal from "../assets/chameleonImages/Jackson's Chameleon/Level 3/Jackson's Chameleon Level 3 GREEN.png";
import Level_3_JacksonsChameleonAngry from "../assets/chameleonImages/Jackson's Chameleon/Level 3/Jackson's Chameleon Level 3 ORANGE-RED.png";

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

// ---------------------------
// coins/monetary display component
// ---------------------------
type FoodInventoryProps = { foodInventory: number };
const FoodInventory: React.FC<FoodInventoryProps> = ({ foodInventory }) => {
  return (
    <div style={{ position: "fixed", top: 60, right: 10, zIndex: 1000 }}>
      <button style={{ width: 120, height: 40, backgroundColor: "brown", color: "white", borderRadius: 5, border: "none", fontWeight: "bold" }} disabled>
        Food Items: {foodInventory}
      </button>
    </div>
  );
};

type MoneyProps = { coins: number };
const Money: React.FC<MoneyProps> = ({ coins }) => {
  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
      <button style={{ width: 80, height: 40, backgroundColor: "black", color: "white", borderRadius: 5, border: "none", fontWeight: "bold" }} disabled>
        Coins: {coins}
      </button>
    </div>
  );
};



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
const FourButtons: React.FC<{petType: string, userId: string | null; onStatsChange?: (stats: any) => void }> = ({ userId, petType, onStatsChange }) => {
  const { open } = useContext(ToastContext);
  const { restartGame } = useRestart();
  



  const [active, setActive] = useState<Category | null>(null);
  const [coins, setCoins] = useState(50);
  const [hydration, setHydration] = useState(hydrationStartLevel);
  const [energy, setEnergy] = useState(energyStartLevel);
  const [hunger, setHunger] = useState(hungerStartLevel);
  const [happiness, setHappiness] = useState(happinessStartLevel);
  const [health, setHealth] = useState(healthStartLevel);
  const [temperature, setTemperature] = useState(temperatureStart);
  const [openModal, setOpenModal] = useState(false);
  const [win_lose, setWin_lose] = useState("somehow got here");
  const [trickt2unlocked, setTrickt2unlocked] = useState(false);
  const [foodInventory, setFoodInventory] = useState(0);
  const [lockedActions, setLockedActions] = useState<Set<string>>(new Set());
  const [napUntil, setNapUntil] = useState<number | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [, setTick] = useState(0);
  const [tempChangeUntil, setTempChangeUntil] = useState<number | null>(null);

  const [level, setlevel] = useState(1)
  const [unlockedEarnSpots, setunlockedEarnSpots] = useState(level)
  
  // dynamic Earn actions
  const [dynamicEarnActions, setDynamicEarnActions] = useState<Action[]>([]);

  const canAddEarnSlot = dynamicEarnActions.length < unlockedEarnSpots;

  // modal for adding Earn action
  const [earnModalOpen, setEarnModalOpen] = useState(false);
  const [newEarnName, setNewEarnName] = useState("");
  const [newEarnCoins, setNewEarnCoins] = useState<number>(20);
  const [whichChameleon, setWhichChameleon] = useState<string>("");

  const pantherImages = {
    
  1: {
    happy: Level_1_PantherChameleonHappy,
    normal: Level_1_PantherChameleonNormal,
    sick: Level_1_PantherChameleonSick,
    angry: Level_1_PantherChameleonAngry,
  },
  2: {
    happy: Level_2_PantherChameleonHappy,
    normal: Level_2_PantherChameleonNormal,
    sick: Level_2_PantherChameleonSick,
    angry: Level_2_PantherChameleonAngry,
  },
  3: {
    happy: Level_3_PantherChameleonHappy,
    normal: Level_3_PantherChameleonNormal,
    sick: Level_3_PantherChameleonSick,
    angry: Level_3_PantherChameleonAngry,
  },
  };
  const jacksonsImages = {
    
  1: {
    happy: Level_1_JacksonsChameleonHappy,
    normal: Level_1_JacksonsChameleonNormal,
    sick: Level_1_JacksonsChameleonSick,
    angry: Level_1_JacksonsChameleonAngry,
  },
  2: {
    happy: Level_2_JacksonsChameleonHappy,
    normal: Level_2_JacksonsChameleonNormal,
    sick: Level_2_JacksonsChameleonSick,
    angry: Level_2_JacksonsChameleonAngry,
  },
  3: {
    happy: Level_3_JacksonsChameleonHappy,
    normal: Level_3_JacksonsChameleonNormal,
    sick: Level_3_JacksonsChameleonSick,
    angry: Level_3_JacksonsChameleonAngry,
  },
  };

  type Mood = "happy" | "normal" | "sick" | "angry";
  type ImageLevel = 1 | 2 | 3;

  useEffect(() => {
    const mood: Mood =
      happiness >= 90 ? "happy" :
      health <= 30 ? "sick" :
      hunger <= 30 ? "angry" :
      hydration <= 30 ? "angry" :
      energy <= 30 ? "sick" :
      "normal";
  const safeLevel: ImageLevel = (Math.min(level, 3) as ImageLevel);

  if (petType === "Panther Chameleon") {
    setWhichChameleon(pantherImages[safeLevel][mood]);
  } else if (petType === "Jackson's Chameleon") {
    setWhichChameleon(jacksonsImages[safeLevel][mood]);
  }

  }, [happiness, health,hunger,hydration,energy, level]);



  
  //---------------------------
  // Pass stats to parent / dashboard whenever they change
  //---------------------------
  useEffect(() => {
    if (onStatsChange) {
      onStatsChange({
        coins,
        energy,
        hunger,
        hydration,
        happiness,
        health,
        temperature,
        level,
        foodInventory,
        trickt2unlocked,
        unlockedEarnSpots,
        dynamicEarnActions
      });
    }
  }, [coins, energy, hunger, hydration, happiness, health, temperature, level, foodInventory, trickt2unlocked, unlockedEarnSpots, dynamicEarnActions]);

  //---------------------------
  // Tick interval for countdowns
  //---------------------------
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  //---------------------------
  // Temperature change
  //---------------------------
  useEffect(() => {
    const scheduleNextTempChange = () => setTempChangeUntil(Date.now() + 2 * 60 * 1000);
    const changeTempRandomly = () => {
      const changeAmount = randomNumberInRange(5, 20);
      const direction = Math.random() < 0.5 ? -1 : 1;
      setTemperature((t) => Math.max(30, Math.min(150, t + changeAmount * direction)));
      scheduleNextTempChange();
    };
    const checkAndChange = () => {
      if (tempChangeUntil === null) scheduleNextTempChange();
      else if (tempChangeUntil <= Date.now()) changeTempRandomly();
    };
    const interval = setInterval(checkAndChange, 1000);
    return () => clearInterval(interval);
  }, [tempChangeUntil]);

  //-------------------
  //death stuff
  //-------------------

  useEffect(() => {
  // Count how many stats are at or below 0
  const stats = [energy, hunger, hydration, happiness, health];
  const statsAtZero = stats.filter(stat => stat <= 0).length;
  
  // If 2 or more stats hit zero, the chameleon dies
  if (statsAtZero >= 2) {
    setWin_lose('LOST - Your chameleon died from neglect 💀');
    setOpenModal(true);
  }
  }, [energy, hunger, hydration, happiness, health]);

// Also update your modal to handle the loss case better:
// In your modal, change the regular restart screen section to:

  useEffect(() => {
  if (userId) {
    loadGameData(userId);
  }
}, [userId]);

  const saveGameData = async (uid: string) => {
  try {
    await setDoc(doc(db, "users", uid), {
      coins,
      level,
      energy,
      hunger,
      hydration,
      happiness,
      health,
      temperature,
      foodInventory,
      trickt2unlocked,
      unlockedEarnSpots,
      dynamicEarnActions,
      lastSaved: new Date().toISOString()
    }, { merge: true }); 
    console.log("Game saved!");
    console.log("Saving as UID:", uid);
  } catch (error) {
    console.error("Error saving game:", error);
    console.log("Saving as UID:", uid);
  }
};
const loadGameData = async (uid: string) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Load all the saved data
      setCoins(data.coins || 50);
      setlevel(data.level || 1);
      setEnergy(data.energy || 50);
      setHunger(data.hunger || 50);
      setHydration(data.hydration || 50);
      setHappiness(data.happiness || 50);
      setHealth(data.health || 50);
      setTemperature(data.temperature || 75);
      setFoodInventory(data.foodInventory || 0);
      setTrickt2unlocked(data.trickt2unlocked || false);
      setunlockedEarnSpots(data.unlockedEarnSpots || 1);
      setDynamicEarnActions(data.dynamicEarnActions || []);
      
      open(
        <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg">
          Welcome back! Game loaded.
        </div>,
        3000
      );
    } else {
      console.log("No saved game found, starting fresh!");
    }
  } catch (error) {
    console.error("Error loading game:", error);
  }
};
useEffect(() => {
  if (!userId) return;
  
  const interval = setInterval(() => {
    // Save with current values directly
    setDoc(doc(db, "users", userId), {
      coins,
      level,
      energy,
      hunger,
      hydration,
      happiness,
      health,
      temperature,
      foodInventory,
      trickt2unlocked,
      unlockedEarnSpots,
      dynamicEarnActions,
      lastSaved: new Date().toISOString()
    }, { merge: true }).then(() => {
      console.log("Game saved!");
    }).catch((error) => {
      console.error("Error saving game:", error);
    });
  }, 10000);
  
  return () => clearInterval(interval);
}, [userId, coins, level, energy, hunger, hydration, happiness, health, 
    temperature, foodInventory, trickt2unlocked, unlockedEarnSpots, dynamicEarnActions]);

// Regular Restart/Loss Screen
  <>
  <div className="text-5xl mb-4">😢</div>
  <h2 className="text-2xl font-bold text-red-600 mb-2">Game Over</h2>
  <div className="mx-auto my-4 w-64">
    <h3 className="text-lg font-black text-gray-800">{win_lose}</h3>
  </div>
  <div className="flex gap-4">
    <button 
      className="btn btn-danger w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
      onClick={restartGame}
    >
      Try Again
    </button>
  </div>
  </>


  //--------------------------
  //level system for evolution
  //--------------------------
  useEffect(() => {
  // Count how many stats are above 90
  const stats = [energy, hunger, hydration, happiness, health];
  const statsAbove90 = stats.filter(stat => stat > 90).length;
  // Calculate required stats based on current level
  const requiredStats = level + 1; // Level 1 needs 2 stats, Level 2 needs 3 stats, etc.
  
  // Check if player has enough stats above 90 to level up
  if (statsAbove90 >= requiredStats) {
    const newLevel = level + 1;
    if (level==3){
      setWin_lose('WIN');
      setOpenModal(true);
      if (userId) saveGameData(userId);
    }
    // Level up and reset all stats to 50
    setlevel(newLevel);
    setunlockedEarnSpots(newLevel);
    setEnergy(50);
    setHunger(50);
    setHydration(50);
    setHappiness(50);
    setHealth(50);
    
    open(
      <div className="bg-purple-500 text-white px-4 py-3 rounded-lg shadow-lg font-bold">
        LEVEL UP! You're now Level {newLevel}! 
        <br />
        Stats reset to 50. Unlocked {newLevel} Earn action slots!
      </div>,
      4000
      );
    }
  }, [energy, hunger, hydration, happiness, health, level, open]);

  type LevelDisplayProps = { level: number };
  const LevelDisplay: React.FC<LevelDisplayProps> = ({ level }) => {
    return (
      <div style={{ position: "fixed", top: 110, right: 10, zIndex: 1000 }}>
        <h1>Level: {level}</h1>
      </div>
    );
  };





  // Toggle main category
  const toggleCategory = (category: Category) => setActive(active === category ? null : category);

  //---------------------------
  // handle clicking a sub-action
  //---------------------------

  const handleActionClick = (action: Action) => {
    // check if this is a locked tier 2 trick
    if (action.tiertwotrick === true && !trickt2unlocked) return;

    if (action.hasLock && lockedActions.has(action.name)) {
      open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">You've already done {action.name} today!</div>, 3000);
      return;
    }

    const napActive = napUntil !== null && napUntil > Date.now();
    const isShopOrEarn =
      actions.Shop.some((a) => a.name === action.name) ||
      actions.Earn.some((a) => a.name === action.name) ||
      dynamicEarnActions.some((a) => a.name === action.name);

    if (napActive && !isShopOrEarn) {
      open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is napping — wait until it wakes up.</div>, 3000);
      return;
    }
    
    // ----- COINS -----
    if (action.cost !== undefined) {
      if (coins - action.cost < 0){
        setCoins(0);
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">No money left! Try looking at the Earn catagory. {petType}</div>, 3000);
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
        setHappiness(happiness - 5);
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Health is at maximum! Your chameleon gets restless with too much disturbance.</div>, 3000);
        return;
      } else if (health + action.healthValue <0){
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is in critical condition!!!</div>, 3000);
        return;
      } else {
      setHealth(health + action.healthValue);
      }
    }

    // ----- FOOD -----
    if (action.isFood) {
      if (action.cost !== undefined){
      setCoins(coins - action.cost);
      setFoodInventory(foodInventory + 1);
      open(<div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">You have purchased food! You now have {foodInventory + 1} food items.</div>, 3000);
      return;
      }
    }

    if (action.hungerValue !== undefined) {
      if (foodInventory >= 1) {
        if (hunger + action.hungerValue > 100) {
          if (health >= 5){
            setHealth(health - 5);
            setHunger(100);
            open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is full and cannot eat more! It threw up the food.</div>, 3000);
            setFoodInventory(foodInventory - 1);
            return;
          } else {
            open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is in critical condition!!!</div>, 3000);
            return;
          }

        } else if (hunger + action.hungerValue < 0){
          open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is too hungry to do that!</div>, 3000);
          return;
        } else {
          setHunger(hunger + action.hungerValue)
          setFoodInventory(foodInventory - 1);
        }
      } else {
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">No food available in inventory! Please buy food from the shop.</div>, 3000);
      }
    }

    // ----- TIER 2 TRICKS -----
    if (action.unlockstier2tricks) {
      setTrickt2unlocked(true);
      open(<div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">Tier 2 Tricks Unlocked! You can now teach Fetch and Target Training.</div>, 3000);
    }

    // ----- NAP -----
    if (action.name === "Nap" && action.cooldown !== undefined) {
      setNapUntil(Date.now() + action.cooldown * 60 * 1000);
      open(<div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is now napping for {action.cooldown} minutes.</div>, 3000);
    }
    // ----- HAPPINESS -----
    if (action.happinessValue !== undefined) {
      if (action.happinessValue + happiness < 0){
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is very depressed! It cannot accomplish this action!</div>, 3000);
        return;
      } else if (action.happinessValue + happiness > 100){
        setHappiness(100);
      } else {
        setHappiness(happiness + action.happinessValue);
      }
      console.log("Happiness:", happiness);
    }

    // ----- ENERGY -----
    if (action.energyValue !== undefined) {
      if (energy + action.energyValue > 100){ 
        setEnergy(100)
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Energy is at maximum!</div>, 3000);
        return;
      } else if (energy + action.energyValue < 0) {
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is too tired to do that!</div>, 3000);
        return;
      } else {
        setEnergy(energy + action.energyValue);
      }
    }

    // ----- HYDRATION -----
    if (action.hydrationValue !== undefined) {
      if (action.hydrationValue + hydration < 0){
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is very thirsty! It cannot accomplish this action!</div>, 3000);
        return;
      } else if (action.hydrationValue + hydration > 100){
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is not thirsty anymore!</div>, 3000);
        setHydration(100);
      } else {
        setHydration(hydration + action.hydrationValue);
      }
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
      <p>Image path: {whichChameleon}</p>
      <div className="left-panel">
      <img src={whichChameleon} alt="Chameleon" className="chameleon-image" />
      </div>
      <Money coins={coins} />
      <FoodInventory foodInventory={foodInventory} />
      <LevelDisplay level={level} />

      <HealthBars energy={energy} hunger={hunger} happiness={happiness} health={health} hydration={hydration} temperature={temperature}
        onIncreaseTemp={() => setTemperature((t) => Math.min(150, t + 1))}
        onDecreaseTemp={() => setTemperature((t) => Math.max(30, t - 1))} />

      {/* Restart modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div className="text-center w-56">
          <h2>Restart Game?</h2>
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">You {win_lose}</h3>
          </div>
          <div className="flex gap-4">
            <button className="btn btn-danger w-full" onClick={restartGame}>Restart</button>
          </div>
        </div>
      </Modal>

      {/* Earn modal */}
    <Modal isOpen={earnModalOpen} onClose={() => setEarnModalOpen(false)}>
    <div className="text-center w-64">
      <h2>Add Earn Action</h2>

      <input
        className="input"
        placeholder="Action Name"
        value={newEarnName}
        onChange={e => setNewEarnName(e.target.value)}
      />

      <input
        className="input mt-2"
        type="number"
        placeholder="Coins to give"
        min={0}
        max={30}
        value={newEarnCoins}
        onChange={e => {
        const value = Number(e.target.value);
        setNewEarnCoins(Math.min(30, Math.max(0, value)));}}
      />

      <button
        className="btn btn-primary mt-2 w-full"
        onClick={() => {
        if (!newEarnName) return;

        const safeCoins = Math.min(30, Math.max(0, newEarnCoins));

        const newAction: Action = {
          name: newEarnName,
          cost: -safeCoins,
          cooldown: 15,
        };

        setDynamicEarnActions(prev => [...prev, newAction]);

        open(
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
            Added new Earn action: {newAction.name}
          </div>,
          3000
        );

        setNewEarnName("");
        setNewEarnCoins(20);
        setEarnModalOpen(false);}}
      >
      Add
      </button>
    </div>
    </Modal>


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
          {[...actions[active], ...(active === "Earn" ? dynamicEarnActions : [])].map(action => {
            const cooldownEnd = cooldowns[action.name] ?? 0;
            const cooldownRemaining = Math.max(0, cooldownEnd - Date.now());
            const disabled = cooldownRemaining > 0; // add other disable logic if needed
            const formatMs = (ms: number) => { const total = Math.ceil(ms/1000); return `${Math.floor(total/60)}:${(total%60).toString().padStart(2,"0")}`; };
            return (
              <button key={action.name} className="sub-btn" disabled={disabled} onClick={() => handleActionClick(action)}>
                {action.name} {action.cost !== undefined && `— $${Math.abs(action.cost)}`} {cooldownRemaining>0 && `— ${formatMs(cooldownRemaining)}`}
              </button>
            );
          })}

          {/* Add Earn action button */}
          {active === "Earn" && (
            <button className="sub-btn" onClick={() => {
              if (!canAddEarnSlot){
                open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Maybe try leveling up before adding another Earn action!</div>, 3000);
                return;
              }
              setEarnModalOpen(true)}}>
              + Add Earn Action
              </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FourButtons;
