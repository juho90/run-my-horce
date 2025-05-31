"use client";

import { useEffect, useState } from "react";

type Horse = {
  id: string;
  name: string;
  speed: number;
  stamina: number;
  power: number;
};

export default function HorsesPage() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [form, setForm] = useState({
    name: "",
    speed: 5,
    stamina: 5,
    power: 5,
  });

  const fetchHorses = () => {
    fetch("/api/horse")
      .then((res) => res.json())
      .then(setHorses)
      .catch((err) => console.error("Failed to fetch horses:", err));
  };

  useEffect(() => {
    fetchHorses();
  }, []);

  const createHorse = async () => {
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    await fetch("/api/create-horse", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setForm({ name: "", speed: 5, stamina: 5, power: 5 });
    setTimeout(fetchHorses, 500); // Kafka 처리 시간 고려해 딜레이 후 재요청
  };

  return (
    <>
      <h1>🐎 Horse List</h1>
      <ul>
        {horses.map((horse) => (
          <li key={horse.id}>
            {horse.name} – Speed: {horse.speed}, Stamina: {horse.stamina},
            Power: {horse.power}
          </li>
        ))}
      </ul>

      <hr />

      <h2>Add New Horse</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 300,
          gap: 8,
        }}
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Speed"
          value={form.speed}
          onChange={(e) => setForm({ ...form, speed: +e.target.value })}
        />
        <input
          type="number"
          placeholder="Stamina"
          value={form.stamina}
          onChange={(e) => setForm({ ...form, stamina: +e.target.value })}
        />
        <input
          type="number"
          placeholder="Power"
          value={form.power}
          onChange={(e) => setForm({ ...form, power: +e.target.value })}
        />
        <button onClick={createHorse}>Create Horse</button>
      </div>
    </>
  );
}
