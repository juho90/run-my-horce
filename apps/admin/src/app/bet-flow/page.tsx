"use client";

import { useEffect, useState } from "react";

type Horse = {
  id: number;
  name: string;
  speed: number;
  stamina: number;
  power: number;
};

type Race = {
  id: number;
  state: string;
  startedAt?: string;
  stoppedAt?: string;
};

type BetSummary = {
  horseId: number;
  totalAmount: number;
};

export default function BetFlowTestPage() {
  const [log, setLog] = useState<string[]>([]);
  const [horses, setHorses] = useState<Horse[]>([]);
  const [race, setRace] = useState<Race | null>(null);
  const [betSummary, setBetSummary] = useState<BetSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const appendLog = (msg: string) => {
    setLog((prev) => [...prev, msg]);
  };

  // 말 목록 조회
  const fetchHorses = async () => {
    appendLog("말 목록 조회");
    const res = await fetch("/api/get-horse");
    if (res.ok) {
      const data = await res.json();
      setHorses(data);
      appendLog(`말 ${data.length}마리 불러오기 성공`);
    } else {
      appendLog("말 불러오기 실패");
    }
  };

  // 레이스 정보 조회
  const fetchRace = async () => {
    appendLog("레이스 정보 조회");
    const res = await fetch("/api/get-race");
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        setRace(data);
        appendLog("레이스 불러오기 성공");
      } else {
        setRace(null);
        appendLog("진행 중인 레이스가 없습니다.");
      }
    } else {
      setRace(null);
      appendLog("레이스 불러오기 실패");
    }
  };

  // 베팅 요약 정보 조회
  const fetchBetSummary = async () => {
    if (!race) {
      setBetSummary([]);
      return;
    }
    appendLog("베팅 요약 정보 조회");
    const res = await fetch(`/api/get-betsummary?raceId=${race.id}`);
    if (res.ok) {
      const data = await res.json();
      setBetSummary(data);
      appendLog(`베팅 요약 ${data.length}개 불러오기 성공`);
    } else {
      setBetSummary([]);
      appendLog("베팅 요약 정보 불러오기 실패");
    }
  };

  // 1~10 랜덤값 생성
  const randStat = () => {
    return Math.floor(Math.random() * 10) + 1;
  };

  // 말 10마리 생성 (랜덤 스탯)
  const createHorses = async () => {
    setLoading(true);
    appendLog("말 10마리 생성 시작");
    for (let index = 1; index <= 10; index++) {
      const res = await fetch("/api/create-horse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `테스트말${index}`,
          speed: randStat(),
          stamina: randStat(),
          power: randStat(),
        }),
      });
      if (res.ok) {
        appendLog(`테스트말${index} 생성 완료`);
      } else {
        appendLog(`테스트말${index} 생성 실패`);
      }
    }
    await fetchHorses();
    setLoading(false);
  };

  // 유저 베팅 데이터 100개 생성
  const createUserBets = async () => {
    if (!race) {
      return;
    }
    appendLog("유저 베팅 데이터 100개 생성 시작");
    setLoading(true);
    const horseIds = horses.map((h) => h.id);
    for (let index = 1; index <= 100; index++) {
      const discordId = `user${index}`;
      const horseId = horseIds[Math.floor(Math.random() * horseIds.length)];
      const amount = Math.floor(Math.random() * 1000) + 100;
      const res = await fetch("/api/create-bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discordId: discordId,
          raceId: race.id,
          horseId: horseId,
          amount: amount,
        }),
      });
      if (res.ok && index % 10 === 0) {
        appendLog(`${index}개 베팅 생성됨`);
      }
    }
    appendLog("유저 베팅 데이터 100개 생성 완료");
    await fetchBetSummary();
    setLoading(false);
  };

  const startRace = async () => {
    appendLog("레이스 시작 요청");
    const res = await fetch("/api/start-race", { method: "POST" });
    if (res.ok) {
      appendLog("레이스 시작됨");
      await fetchRace();
      await fetchBetSummary();
    } else {
      appendLog("레이스 시작 실패");
    }
  };

  const stopRace = async () => {
    appendLog("레이스 정지 요청");
    const res = await fetch("/api/stop-race", { method: "POST" });
    if (res.ok) {
      appendLog("레이스 정지됨");
      fetchRace();
    } else {
      appendLog("레이스 정지 실패");
    }
  };

  const settleRace = async () => {
    appendLog("정산 요청");
    const res = await fetch("/api/settle", { method: "POST" });
    if (res.ok) {
      appendLog("정산 완료");
    } else {
      appendLog("정산 실패");
    }
  };

  useEffect(() => {
    fetchHorses();
    fetchRace();
  }, []);

  // 레이스 정보가 바뀌면 베팅 요약 정보도 새로 조회
  useEffect(() => {
    if (race) {
      fetchBetSummary();
    } else {
      setBetSummary([]);
    }
  }, [race]);

  return (
    <div style={{ padding: 32 }}>
      <h1>전체 플로우 테스트</h1>
      <div style={{ marginBottom: 16 }}>
        <h3>말 목록</h3>
        {horses.length === 0 ? (
          <div>
            <p>등록된 말이 없습니다.</p>
            <button onClick={createHorses} disabled={loading}>
              {loading ? "생성 중..." : "말 10마리 생성"}
            </button>
          </div>
        ) : (
          <ul>
            {horses.map((horse) => (
              <li key={horse.id}>
                {horse.id}: {horse.name} (Speed: {horse.speed}, Stamina:{" "}
                {horse.stamina}, Power: {horse.power})
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <h3>레이스 정보</h3>
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
          <p>진행 중인 레이스가 없습니다.</p>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={createUserBets}
          disabled={loading || !race}
          style={{ opacity: !race ? 0.5 : 1 }}
        >
          {loading ? "생성 중..." : "유저 베팅 데이터 100개 생성"}
        </button>
        <button onClick={startRace} style={{ marginLeft: 8 }}>
          레이스 시작
        </button>
        <button onClick={stopRace} style={{ marginLeft: 8 }}>
          레이스 정지
        </button>
        <button onClick={settleRace} style={{ marginLeft: 8 }}>
          정산
        </button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <h3>베팅 요약</h3>
        {!race ? (
          <p>레이스가 없으면 베팅 정보를 볼 수 없습니다.</p>
        ) : betSummary.length === 0 ? (
          <p>베팅 데이터가 없습니다.</p>
        ) : (
          <ul>
            {betSummary.map((summary) => {
              const horse = horses.find((h) => h.id === summary.horseId);
              return (
                <li key={summary.horseId}>
                  {horse ? `${horse.name}` : `말#${summary.horseId}`} :{" "}
                  {summary.totalAmount}원
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div style={{ marginTop: 24 }}>
        <h3>로그</h3>
        <pre>{log.join("\n")}</pre>
      </div>
    </div>
  );
}
