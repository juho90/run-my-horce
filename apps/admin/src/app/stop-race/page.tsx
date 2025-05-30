"use client";

export default function StopRacePage() {
  const stopRace = async () => {
    const res = await fetch("/api/stop-race", { method: "POST" });
    alert((await res.json()).ok ? "Race stopped!" : "Failed");
  };

  return (
    <>
      <h1>🛑 Stop Race</h1>
      <button onClick={stopRace}>Stop</button>
    </>
  );
}
