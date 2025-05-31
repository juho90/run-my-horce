"use client";

import { useEffect, useState } from "react";

type Race = {
  id: number;
  state: string;
  startedAt?: string;
  stoppedAt?: string;
};

export default function RaceFlowPage() {
  const [log, setLog] = useState<string[]>([]);
  const [race, setRace] = useState<Race | null>(null);

  const appendLog = (msg: string) => setLog((prev) => [...prev, msg]);

  // 레이스 정보 조회
  const fetchRaces = async () => {
    appendLog("레이스 정보 조회");
    const res = await fetch("/api/get-race");
    if (res.ok) {
      const data = await res.json();
      setRace(data);
      appendLog("레이스 불러오기 성공");
    } else {
      appendLog("레이스 불러오기 실패");
    }
  };

  // 페이지 진입 시 1회 호출
  useEffect(() => {
    fetchRaces();
  }, []);

  // 레이스 시작
  const startRace = async () => {
    appendLog("레이스 시작 요청");
    const res = await fetch("/api/start-race", { method: "POST" });
    if (res.ok) {
      appendLog("레이스 시작됨");
      fetchRaces();
    } else {
      appendLog("레이스 시작 실패");
    }
  };

  // 레이스 정지
  const stopRace = async () => {
    appendLog("레이스 정지 요청");
    const res = await fetch("/api/stop-race", { method: "POST" });
    if (res.ok) {
      appendLog("레이스 정지됨");
      fetchRaces();
    } else {
      appendLog("레이스 정지 실패");
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>🏁 Race Flow 통합 테스트</h1>
      <div style={{ marginBottom: 16 }}>
        <h1>📊 레이스 상태</h1>
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
        <button onClick={startRace} style={{ marginLeft: 8 }}>
          레이스 시작
        </button>
        <button onClick={stopRace} style={{ marginLeft: 8 }}>
          레이스 정지
        </button>
      </div>
      <div>
        <h3>로그</h3>
        <pre>{log.join("\n")}</pre>
      </div>
    </div>
  );
}
