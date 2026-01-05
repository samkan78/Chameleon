// FourButtons.tsx
import React, { useState, useContext, useEffect } from "react";
import "./fourbuttons.css";
import dingSound from "../assets/ding.mp3";
import HealthBars from "./healthbars";
import ToastContext from "./ToastService";
import Modal from "./modal.tsx";
import { useRestart } from "./RestartContext";

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
    { name: "Check Eyes", healthValue: 10, happinessValue: -10 },
    { name: "Trim Nails", healthValue: 5, happinessValue: -10 },
    { name: "Check Skin Shedding", healthValue: 15, happinessValue: -10 },
    { name: "Clean Enclosure", healthValue: 10, happinessValue: -10 },
    { name: "Vet Visit", cost: 75, healthValue: 50, happinessValue: -25, hydrationValue: 30, energyValue: -10, hungerValue: 30 },
  ],
  Care: [
    { name: "Play", happinessValue: 30, hungerValue: -15 },
    { name: "Misting", hydrationValue: 20, cost: 4 },
    { name: "Feed", hungerValue: 15, hasFood: true },
    { name: "Nap", energyValue: 25, cooldown: 2 },
    { name: "Adjust Temperature", popuptest: true },
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
const FourButtons: React.FC = () => {
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

  // dynamic Earn actions
  const [dynamicEarnActions, setDynamicEarnActions] = useState<Action[]>([]);

  // modal for adding Earn action
  const [earnModalOpen, setEarnModalOpen] = useState(false);
  const [newEarnName, setNewEarnName] = useState("");
  const [newEarnCoins, setNewEarnCoins] = useState<number>(20);

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

  // Toggle main category
  const toggleCategory = (category: Category) => setActive(active === category ? null : category);

  //---------------------------
  // handle clicking a sub-action
  //---------------------------

  const handleActionClick = (action: Action) => {
    // ====== ORIGINAL LOGIC KEPT ======
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
        open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">No money left! Try looking at the Earn catagory.</div>, 3000);
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
      } else setHealth(health + action.healthValue);
    }

    // ----- FOOD -----
    if (action.isFood) {
      if (action.cost !== undefined) setCoins(coins - action.cost);
      setFoodInventory(foodInventory + 1);
      open(<div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">You have purchased food! You now have {foodInventory + 1} food items.</div>, 3000);
      return;
    }

    if (action.hungerValue !== undefined) {
      if (foodInventory >= 1) {
        if (hunger + action.hungerValue > 100) {
          setHealth(health - 5);
          setHunger(100);
          open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is full and cannot eat more! It threw up the food.</div>, 3000);
          setFoodInventory(foodInventory - 1);
          return;
        } else setHunger(hunger + action.hungerValue), setFoodInventory(foodInventory - 1);
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
    if (action.name === "Nap" && action.cooldown) {
      setNapUntil(Date.now() + action.cooldown * 60 * 1000);
      open(<div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is now napping for {action.cooldown} minutes.</div>, 3000);
    }

    // ----- ENERGY -----
    if (action.energyValue !== undefined) {
      if (energy + action.energyValue > 100) setEnergy(100), open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Energy is at maximum!</div>, 3000);
      else if (energy + action.energyValue < 0) setEnergy(0), open(<div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">Your chameleon is too tired to do that!</div>, 3000);
      else setEnergy(energy + action.energyValue);
    }

    // ----- HAPPINESS -----
    if (action.happinessValue !== undefined) {
      setHappiness(Math.min(100, happiness + action.happinessValue));
    }

    // ----- HYDRATION -----
    if (action.hydrationValue !== undefined) {
      setHydration(Math.min(100, hydration + action.hydrationValue));
    }
    // ----- COOLDOWNS -----
    if (action.cooldown!==undefined) setCooldowns(prev => ({ ...prev, [action.name]: Date.now() + action.cooldown * 60 * 1000 }));

    // ----- LOCKED ACTIONS -----
    if (action.hasLock) setLockedActions(prev => new Set(prev).add(action.name));
  };

  //---------------------------
  // Render
  //---------------------------
  return (
    <div className="four-buttons-wrapper">
      <Money coins={coins} />
      <FoodInventory foodInventory={foodInventory} />

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
          <input className="input" placeholder="Action Name" value={newEarnName} onChange={e => setNewEarnName(e.target.value)} />
          <input className="input mt-2" type="number" placeholder="Coins to give" value={newEarnCoins} onChange={e => setNewEarnCoins(Number(e.target.value))} />
          <button className="btn btn-primary mt-2 w-full" onClick={() => {
            if (!newEarnName) return;
            const newAction: Action = { name: newEarnName, cost: -Math.abs(newEarnCoins), cooldown: 15 };
            setDynamicEarnActions(prev => [...prev, newAction]);
            open(<div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">Added new Earn action: {newAction.name}</div>, 3000);
            setNewEarnName(""); setNewEarnCoins(20); setEarnModalOpen(false);
          }}>Add</button>
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
            <button className="sub-btn" onClick={() => setEarnModalOpen(true)}>+ Add Earn Action</button>
          )}
        </div>
      )}
    </div>
  );
};

export default FourButtons;
