"use client";

import { useEffect, useState } from "react";

type Race = {
  id: number;
  state: string;
  startedAt?: string;
  stoppedAt?: string;
};

export default function RacePage() {
  const [race, setRace] = useState<Race | null>(null);

  useEffect(() => {
    fetch("/api/race")
      .then((res) => res.json())
      .then(setRace);
  }, []);

  return (
    <>
      <h1>📊 Race Status</h1>
      {race ? (
        <div>
          <p>🆔 ID: {race.id}</p>
          <p>🏁 상태: {race.state}</p>
          {race.startedAt && (
            <p>🚀 시작: {new Date(race.startedAt).toLocaleString()}</p>
          )}
          {race.stoppedAt && (
            <p>🛑 종료: {new Date(race.stoppedAt).toLocaleString()}</p>
          )}
        </div>
      ) : (
        <p>경주가 없습니다.</p>
      )}
    </>
  );
}
