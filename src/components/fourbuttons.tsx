// FourButtons.tsx
import React, { useState, useContext } from "react";
import "./fourbuttons.css";
import dingSound from "../assets/ding.mp3"; // Import your audio file
import HealthBars from "./healthbars";
import ToastContext from "./ToastService";

// ---------------------------
// defining categories and actions
// ---------------------------

//main buttons/categories
type Category = "Health" | "Care" | "Tricks" | "Shop" | "Earn";

type Action = {
  name: string;
  cost?: number; // Positive = costs coins and Negative = earns coins because its (x-y) and (x--y)=(x+y)
  energyValue?: number; // how much energy it uses or gives, positive = gives energy, negative = uses energy
  hungerValue?: number; // how much hunger it uses or gives, positive = less hungery, negative = more hunger
  hydrationValue?: number; // how much hydration it uses or gives, positive = more hydration, negative = less hydration
  happinessValue?: number; // how much happiness it uses or gives, positive = more happiness, negative = less happiness
  healthValue?: number; // how much health it uses or gives, positive = more health, negative = less health
  hasFood?: boolean; // whether the action involves food
  hasLock?: boolean; // whether the action is a one time thing and then locks
  cooldown?: number; // cooldown time in minutes
  unlockstier2tricks?: boolean; // whether the action unlocks tier 2 tricks meant only for buying branches in shop
  tiertwotrick?: boolean; // whether the action is a tier 2 trick
  isFood?: boolean; // whether the action is food to be used in inventory
};

// ---------------------------
// subbuton actions
// ---------------------------
const actions: Record<Category, Action[]> = {
  Health: [
    { name: "Check Eyes", healthValue: 10, happinessValue: -10  },
    { name: "Trim Nails", healthValue: 5, happinessValue: -10  },
    { name: "Check Skin Shedding", healthValue: 15, happinessValue: -10  },
    { name: "Clean Enclosure", healthValue: 10, happinessValue: -10 },
    { name: "Vet Visit", cost: 75, healthValue: 50, happinessValue: -25, hydrationValue: 30, energyValue: -10, hungerValue: 30  },
  ],
  Care: [
    { name: "Bath" },
    { name: "Misting", hydrationValue: 20, cost: 4 }, //chameleons dont drink water, they absorb it through their skin so this action increases hydration
    { name: "Feed", hungerValue:20, hasFood:true }, //feeding decreases hunger, hasFood indicates food is involved and is used to make sure it is only clickable when food is available in inventory and consumes food item
    { name: "Nap", energyValue: 30, cooldown:2 }, //napping increases energy, cooldown in 2 minutes
    { name: "Adjust Temperature" }, 
  ],
  Tricks: [
    { name: "Climbing Practice", energyValue: -20, happinessValue: 10, hasLock:true }, //climbing practice uses energy but increases happiness, hasLock indicates its a one time action
    { name: "Hand Approach", energyValue: -25, happinessValue: 15, hasLock:true }, //hand approach uses energy but increases happiness, hasLock indicates its a one time action
    { name: "Fetch", energyValue: -30, happinessValue: 20, tiertwotrick:true }, //fetch uses energy but increases happiness, tier 2 trick only available after buying branches
    { name: "Target Training", energyValue: -35, happinessValue: 25, tiertwotrick:true }, //target training uses energy but increases happiness, tier 2 trick only available after buying branches
  ],
  Shop: [
    { name: "Buy Crickets", cost: 5, isFood:true }, //buying food items
    { name: "Buy Mealworms", cost: 5, isFood:true }, //buying food items 
    { name: "Purchase Branches", cost: 10, unlockstier2tricks:true }, //buying branches to unlock tier 2 tricks, cost in money component
  ],
  Earn: [
    { name: "Clean Room", cost: -20, cooldown:5},
    { name: "Do Homework", cost: -30,cooldown:10 },
    { name: "Take a shower", cost: -45, cooldown:15 },
    { name: "Do laundry", cost: -45, cooldown:20 },
  ],
};

// ---------------------------
// coins/monetary display component
// ---------------------------
type foodInventoryProps = { foodInventory: number }; //props from foodinventory.tsx

const FoodInventory: React.FC<foodInventoryProps> = ({ foodInventory }) => {
  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: 60,
    right: 10,
    zIndex: 1000,
  };
  const buttonStyle: React.CSSProperties = {
    width: 120,
    height: 40,
    backgroundColor: "brown",
    color: "white",
    borderRadius: 5,
    border: "none",
    fontWeight: "bold",
  };
  return (
    <div style={containerStyle}>
      <button style={buttonStyle} disabled>
        Food Items: {foodInventory}
      </button>
    </div>
  );
};



type MoneyProps = { coins: number }; //props from money.tsx

const Money: React.FC<MoneyProps> = ({ coins }) => {
  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: 10,
    right: 10,
    zIndex: 1000,
  };

  const buttonStyle: React.CSSProperties = {
    width: 80,
    height: 40,
    backgroundColor: "black",
    color: "white",
    borderRadius: 5,
    border: "none",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} disabled>
        Coins: {coins}
      </button>
    </div>
  );
};
//---------------------------
// random variable function
//---------------------------

const randomNumberInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//---------------------------
// starting levels
//---------------------------


const hydrationStartLevel = randomNumberInRange(10, 40);
const energyStartLevel = randomNumberInRange(10,40);
const hungerStartLevel = randomNumberInRange(10, 40);
const happinessStartLevel = randomNumberInRange(10, 40);
const healthStartLevel = randomNumberInRange(10, 40);


// ---------------------------
// main buttons
// ---------------------------

const FourButtons: React.FC = () => {
  const [active, setActive] = useState<Category | null>(null);
  const [coins, setCoins] = useState(50);
  const [hydration, setHydration] = useState(hydrationStartLevel);
  const [energy, setEnergy] = useState(energyStartLevel);
  const [hunger, setHunger] = useState(hungerStartLevel);
  const [happiness, setHappiness] = useState(happinessStartLevel);
  const [health, setHealth] = useState(healthStartLevel);
  const [trickt2unlocked, setTrickt2unlocked] = useState(false); //tier 2 trick unlock state
  const [foodInventory, setfoodInventory] = useState(0) //inventory state for food items
  const [lockedActions, setLockedActions] = useState<Set<string>>(new Set()); // Track which locked actions have been used
  const { open } = useContext(ToastContext);
  // Toggle main category
  const toggleCategory = (category: Category) => {
    setActive(active === category ? null : category);
  };

  // ---------------------------
  // Handle clicking a sub-action
  // ---------------------------

  const handleActionClick = (action: Action) => {
    // Check if this is a locked tier 2 trick - if so, do nothing
    if (action.tiertwotrick === true && !trickt2unlocked) {
      return;
    }

    // Check if this action has a lock and has already been used
    if (action.hasLock && lockedActions.has(action.name)) {
      open(
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          You've already done ${action.name} today!
        </div>,
        3000
        );
      return;
    }


    if (action.healthValue !== undefined) {
      if (health + action.healthValue>100){ //checking if health exceeds 100
        setHealth(100);
        open(
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          Health is at maximum!
        </div>,
        3000
        ); //notification for checking up for no reason
        return;
      } else {
      //health value for bar
      setHealth(health + action.healthValue);
      }
    }
    //Food count
    if (action.isFood) {
      // Logic to add food to inventory can be implemented here
      if (action.cost !== undefined){ //safety check
        setCoins(coins - action.cost); //deducting coins for buying food
      }
      setfoodInventory(foodInventory + 1); //increasing food count by 1
      open(
        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
          You have purchased food! You now have {foodInventory + 1} food items in your inventory.
        </div>,
        3000
      );
      return;
    }

    //Hunger
    if (action.hungerValue !== undefined) {
      if (foodInventory >=1) { //checking if food is available in inventory and action involves food
        if (hunger + action.hungerValue>100){ //checking if hunger exceeds 100
        setHealth(health - 5), //decreasing health by 10 if overfed
        setHunger(100); //maxing out hunger
        open(
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          Your chameleon is full and cannot eat more! It threw up the food.
        </div>,
        3000
        ); //notification for overfeeding
        setfoodInventory(foodInventory - 1); //decreasing food count by 1 after feeding
        return;
        } else {
        //hunger value for bar
        setHunger(hunger + action.hungerValue);
        setfoodInventory(foodInventory - 1); //decreasing food count by 1 after feeding
        }
      } else {
        open(
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          No food available in inventory! Please buy food from the shop.
        </div>,
        3000
        );
      }
    }

    //Tier 2 trick unlock handling

    if (action.unlockstier2tricks !== undefined && action.unlockstier2tricks === true) { //unlock tier 2 tricks check
      setTrickt2unlocked(true); //setting tier 2 trick unlock to true
      open(
        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
          Tier 2 Tricks Unlocked! You can now teach your chameleon Fetch and Target Training.
        </div>,
        3000
      );
    }

    //Energy

    if (action.energyValue !== undefined) { 
      if (energy + action.energyValue>100){ //checking if energy exceeds 100
        setEnergy(100);
        open(
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          Energy is at maximum!
        </div>,
        3000
        );
        return;
      } else if (energy + action.energyValue<0){ //checking if energy goes below 0
        setEnergy(0);
        open(
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          Your chameleon is too tired to do that!
        </div>,
        3000
        );
        return;
      } else {
      setEnergy(energy + action.energyValue);
      }
    }
    //Happiness

    if (action.happinessValue !== undefined) {
      if (happiness + action.happinessValue>100){ //checking if happiness exceeds 100
        setHappiness(100);
        return;
      } else {
      //happiness value for bar
      setHappiness(happiness + action.happinessValue);
      }
    }

    //Hydration

    if (action.hydrationValue !== undefined) {
      if (hydration + action.hydrationValue>100){ //checking if hydration exceeds 100
        setHydration(100);
        open(
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
          Your chameleon is not thirsty .
        </div>,
        3000
        );
        return;
      } else {
      //hydration  value for bar
      setHydration(hydration + action.hydrationValue);
      }
    }

    // Coins/Cost Handling

    if (action.cost !== undefined) {
      //coin value in top right,  Negative cost = earn coins
      setCoins(coins - action.cost);
      const audio = new Audio(dingSound); //audio object + noise for informing user of earning/spending coins
      audio.play();
    }

    // Mark locked actions as used
    if (action.hasLock) {
      setLockedActions(prev => new Set(prev).add(action.name));
    }
  };
  
  return (
    <div className="four-buttons-wrapper">
      {/*display coins*/}
      <Money coins={coins} />
      <FoodInventory foodInventory={foodInventory} />
      <HealthBars 
        energy={energy}
        hunger={hunger}
        happiness={happiness}
        health={health}
        hydration={hydration}
      />

      {/*mainbuttons and the function to show subbuttons*/}
      <div className="main-buttons">
        {(Object.keys(actions) as Category[]).map((category) => (
          <button
            key={category}
            className={`main-btn ${active === category ? "active" : ""}`}
            onClick={() => toggleCategory(category)} // showing subbuttons from predifened function
          >
            {category}
          </button>
        ))}
      </div>

      {/*subbuttons and their functions*/}
      {active && (
        <div className="sub-buttons">
          {actions[active].map((action) => {
            const cannotAfford =
              action.cost !== undefined && action.cost > 0 && coins < action.cost; // Disable if not enough coins
            const isTier2LockedTrick = action.tiertwotrick === true && !trickt2unlocked; // Disable if tier 2 trick not unlocked
            const isAlreadyUsed = action.hasLock && lockedActions.has(action.name); // Disable if locked action already used
            return (
              <button
                key={action.name}
                className="sub-btn"
                disabled={cannotAfford || isTier2LockedTrick || isAlreadyUsed}
                onClick={() => handleActionClick(action)}
              >
                {action.name}
                {action.cost !== undefined && ` — $${Math.abs(action.cost)}`} {/*checking if the value is negative so it can add if the action.cost is negative, earning coins*/}
                
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FourButtons;