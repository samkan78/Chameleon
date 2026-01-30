type RestartAnytimeProps = {
  onRestart: () => void;
};
// button component to restart game
export const RestartAnytime = ({ onRestart }: RestartAnytimeProps) => {
  return (
    <button
      onClick={onRestart}
      style={{
        width: 75,
        height: 75,
        backgroundColor: "black",
        color: "white",
      }}
    >
      Restart
    </button>
  );
};
