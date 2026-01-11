import { useState } from "react";

export default function HowToPlay() {
  // tracks whether the popup is visible
  const [show, setShow] = useState(false);

  return (
    <>
      {/* Button that opens the popup */}
      <button onClick={() => setShow(true)}>?</button>

      {/* Popup */}
      {show && (
        <div style={overlay}>
          <div style={popup}>
            <h2>How to Play</h2>
            <p>1. Choose a species of chameleon.</p>
            <p>2. Type in a name for your chameleon.</p>
            <p>
              3. Take care of your chameleon by keeping its environment stable,
              maintaining its health, earning resources, and teaching behaviors.
            </p>
            <p>
              4. Use the in-game currency to purchase items from the store to
              take care of your chameleon and maintains the energy, hunger,
              happiness, temperature comfort, and hydration stats. Make sure the
              chameleon is kept happy and healthy! All of the stat bars will
              decrease every 2 minutes so make sure they do not decrease all the
              way! You can buy food from shop before you feed your chameleon.
              You need to get above a 90% on all the levels for your chameleon
              to move on to the next level.
            </p>
            <p>
              5. Make your chameleon learn tricks to gain in-game currency. You
              can also do chores to gain in-game currency. However, be mindful
              of its energy levels and do not overexert your chameleon.
            </p>

            {/* Close popup */}
            <button onClick={() => setShow(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const popup: React.CSSProperties = {
  background: "#fff",
  padding: "20px",
  width: "350px",
};
