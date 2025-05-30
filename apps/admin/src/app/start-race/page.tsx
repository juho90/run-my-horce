"use client";

export default function StartRacePage() {
  const startRace = async () => {
    const res = await fetch("/api/start-race", { method: "POST" });
    alert((await res.json()).ok ? "Race started!" : "Failed");
  };

  return (
    <>
      <h1>🚀 Start Race</h1>
      <button onClick={startRace}>Start</button>
    </>
  );
}
