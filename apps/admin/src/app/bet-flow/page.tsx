"use client";

import { useState } from "react";

export default function FlowTestPage() {
  const [log, setLog] = useState<string[]>([]);

  const appendLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const createHorses = async () => {
    appendLog("말 10마리 생성 시작");
    for (let i = 1; i <= 10; i++) {
      const res = await fetch("/api/create-horse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `테스트말${i}` }),
      });
      if (res.ok) appendLog(`테스트말${i} 생성 완료`);
      else appendLog(`테스트말${i} 생성 실패`);
    }
  };

  const createUserBets = async () => {
    appendLog("유저 베팅 데이터 생성");
    // 예시: 3명의 유저가 1~10번 말에 각각 100원씩 베팅
    for (let user = 1; user <= 3; user++) {
      for (let horse = 1; horse <= 10; horse++) {
        const res = await fetch("/api/bet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: `user${user}`,
            horseId: horse,
            amount: 100,
          }),
        });
        if (res.ok) appendLog(`user${user} -> 말${horse} 베팅 완료`);
        else appendLog(`user${user} -> 말${horse} 베팅 실패`);
      }
    }
  };

  const createRaceResult = async () => {
    appendLog("레이스 결과 생성 요청");
    const res = await fetch("/api/start-race", { method: "POST" });
    if (res.ok) appendLog("레이스 시작됨");
    else appendLog("레이스 시작 실패");
    // 필요하다면 결과를 받아오는 추가 로직 작성
  };

  const settleRace = async () => {
    appendLog("정산 요청");
    const res = await fetch("/api/settle", { method: "POST" });
    if (res.ok) appendLog("정산 완료");
    else appendLog("정산 실패");
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>전체 플로우 테스트</h1>
      <button onClick={createHorses}>말 10마리 생성</button>
      <button onClick={createUserBets} style={{ marginLeft: 8 }}>
        유저 베팅 데이터 생성
      </button>
      <button onClick={createRaceResult} style={{ marginLeft: 8 }}>
        레이스 결과 생성
      </button>
      <button onClick={settleRace} style={{ marginLeft: 8 }}>
        정산
      </button>
      <div style={{ marginTop: 24 }}>
        <h3>로그</h3>
        <pre>{log.join("\n")}</pre>
      </div>
    </div>
  );
}
