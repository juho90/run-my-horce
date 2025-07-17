"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Horse, HorseViewer } from "./components/horse";
import { Track, TrackViewer } from "./components/track";

type Race = {
  raceId: number;
  state: string;
  settled: boolean;
  startedAt?: string;
  stoppedAt?: string;
};

type Bet = {
  horseId: number;
  totalAmount: number;
};

type RaceResult = {
  raceId: number;
  winnerHorseId: number;
  ranking: number[];
};

export default function BetFlowTestPage() {
  const [log, setLog] = useState<string[]>([]);
  const [race, setRace] = useState<Race | null>(null);
  const [horses, setHorses] = useState<Horse[]>([]);
  const [track, setTrack] = useState<Track | null>(null);
  const [bet, setBet] = useState<Bet[]>([]);
  const [raceLog, setRaceLog] = useState<string | null>(null);
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null);
  const [loading, setLoading] = useState(false);

  const appendLog = (msg: string) => {
    setLog((prev) => [...prev, msg]);
  };

  // 레이스 정보 조회
  const fetchRace = async () => {
    appendLog("레이스 정보 조회");
    const res = await fetch("/api/get-race");
    if (res.ok) {
      const data = await res.json();
      if (data) {
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

  // 말 목록 조회
  const fetchHorses = async () => {
    if (race === null) {
      setHorses([]);
      return;
    }
    appendLog("말 목록 조회");
    const res = await fetch(`/api/get-horse/${race.raceId}`);
    if (res.ok) {
      const data = await res.json();
      setHorses(data);
      appendLog(`말 ${data.length}마리 불러오기 성공`);
    } else {
      appendLog("말 불러오기 실패");
    }
  };

  // 트랙 정보 조회
  const fetchTrack = async () => {
    if (race === null) {
      setTrack(null);
      return;
    }
    appendLog("트랙 정보 조회");
    const res = await fetch(`/api/get-track/${race.raceId}`);
    if (res.ok) {
      const data = await res.json();
      setTrack(data);
      appendLog("트랙 정보 불러오기 성공");
    } else {
      setTrack(null);
      appendLog("트랙 정보 불러오기 실패");
    }
  };

  // 레이스 로그 조회
  const fetchRaceLog = async () => {
    if (race === null) {
      setRaceLog(null);
      return;
    }
    const res = await fetch(`/api/get-race-log/${race.raceId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.html) {
        setRaceLog(data.html);
        appendLog("레이스 로그 조회 성공");
      } else {
        setRaceLog(null);
        appendLog("레이스 로그가 없습니다.");
      }
    } else {
      setRaceLog(null);
      appendLog("레이스 로그 조회 실패");
    }
  };

  // 레이스 결과 조회
  const fetchRaceResult = async () => {
    if (race === null) {
      setRaceResult(null);
      return;
    }
    const res = await fetch(`/api/get-race-result/${race.raceId}`);
    if (res.ok) {
      const data = await res.json();
      setRaceResult(data);
      appendLog("레이스 결과 조회 성공");
    } else {
      setRaceResult(null);
      appendLog("레이스 결과 조회 실패");
    }
  };

  // 베팅 요약 정보 조회
  const fetchBet = async () => {
    if (race === null) {
      setBet([]);
      return;
    }
    appendLog("베팅 요약 정보 조회");
    const res = await fetch(`/api/get-bet/${race.raceId}`);
    if (res.ok) {
      const data = await res.json();
      setBet(data);
      appendLog(`베팅 요약 ${data.length}개 불러오기 성공`);
    } else {
      setBet([]);
      appendLog("베팅 요약 정보 불러오기 실패");
    }
  };

  const startRace = async () => {
    appendLog("레이스 시작 요청");
    const res = await fetch("/api/start-race", { method: "POST" });
    if (res.ok) {
      appendLog("레이스 시작됨");
      await fetchRace();
      await fetchBet();
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
    const res = await fetch("/api/settle-race", { method: "POST" });
    if (res.ok) {
      appendLog("정산 완료");
      fetchRace();
    } else {
      appendLog("정산 실패");
    }
  };

  // 유저 베팅 데이터 100개 생성
  const createUserBets = async () => {
    if (race === null) {
      return;
    }
    appendLog("유저 베팅 데이터 100개 생성 시작");
    setLoading(true);
    const horseIds = horses.map((h) => h.horseId);
    for (let index = 1; index <= 100; index++) {
      const discordId = `user${index}`;
      const horseId = horseIds[Math.floor(Math.random() * horseIds.length)];
      const amount = Math.floor(Math.random() * 1000) + 100;
      const res = await fetch("/api/create-bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discordId: discordId,
          raceId: race.raceId,
          horseId: horseId,
          amount: amount,
        }),
      });
      if (res.ok && index % 10 === 0) {
        appendLog(`${index}개 베팅 생성됨`);
      }
    }
    appendLog("유저 베팅 데이터 100개 생성 완료");
    await fetchBet();
    setLoading(false);
  };

  // 로그 생성
  const createRaceLog = async () => {
    if (race === null) {
      return;
    }
    const res = await fetch("/api/create-race-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raceId: race.raceId,
      }),
    });
    if (res.ok) {
      appendLog("레이스 로그 생성 완료");
      await fetchRaceLog();
    } else {
      appendLog("레이스 로그 생성 실패");
    }
  };

  // 결과 생성
  const createRaceResult = async () => {
    if (race === null) {
      return;
    }
    const shuffled = [...horses].sort(() => Math.random() - 0.5);
    const winnerHorseId = shuffled[0].horseId;
    const ranking = shuffled.map((h) => h.horseId);
    const res = await fetch("/api/create-race-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raceId: race.raceId,
        winnerHorseId,
        ranking,
      }),
    });
    if (res.ok) {
      appendLog("레이스 결과 생성 완료");
      await fetchHorses();
      await fetchRaceResult();
    } else {
      appendLog("레이스 결과 생성 실패");
    }
  };

  useEffect(() => {
    fetchRace();
  }, []);

  useEffect(() => {
    if (race) {
      fetchHorses();
      fetchTrack();
      fetchRaceLog();
      fetchRaceResult();
      fetchBet();
    } else {
      setHorses([]);
      setTrack(null);
      setRaceLog(null);
      setRaceResult(null);
      setBet([]);
    }
  }, [race]);

  return (
    <div style={{ padding: 32 }}>
      <h1>전체 플로우 테스트</h1>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={startRace}>레이스 시작</button>
          <button onClick={stopRace}>레이스 정지</button>
          <button onClick={createRaceLog} disabled={race === null}>
            레이스 로그 생성
          </button>
          <button
            onClick={createRaceResult}
            disabled={race === null || raceResult !== null}
          >
            레이스 결과 생성
          </button>
          <button
            onClick={createUserBets}
            disabled={loading || race === null || bet.length > 0}
            style={{ opacity: race === null ? 0.5 : 1 }}
          >
            {loading ? "생성 중..." : "유저 베팅 데이터 100개 생성"}
          </button>
          <button
            onClick={settleRace}
            disabled={
              loading ||
              race === null ||
              race.state !== "finished" ||
              bet.length === 0
            }
          >
            정산
          </button>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <h3>레이스 정보</h3>
        {race === null ? (
          <p>진행 중인 레이스가 없습니다.</p>
        ) : (
          <div>
            <p>🆔 ID: {race.raceId}</p>
            <p>🏁 상태: {race.state}</p>
            {race.startedAt && (
              <p>🚀 시작: {new Date(race.startedAt).toLocaleString()}</p>
            )}
            {race.stoppedAt && (
              <p>🛑 종료: {new Date(race.stoppedAt).toLocaleString()}</p>
            )}
          </div>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <h3>말 목록</h3>
        {horses.length === 0 ? (
          <div>
            <p>등록된 말이 없습니다.</p>
          </div>
        ) : (
          <HorseViewer horses={horses} />
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <h3>트랙 정보</h3>
        {track === null ? (
          <p>트랙 정보가 없습니다.</p>
        ) : (
          <TrackViewer track={track} />
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <h3>레이스 로그</h3>
        {raceLog === null ? (
          <p>레이스 로그가 없습니다.</p>
        ) : (
          <div>
            <p>
              <Link
                href={raceLog}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0066cc",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                🔗 레이스 로그 보기
              </Link>
            </p>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              URL: {raceLog}
            </p>
          </div>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <h3>레이스 결과</h3>
        {raceResult === null ? (
          <p>레이스 결과가 없습니다.</p>
        ) : (
          <div>
            <p>우승마: {raceResult.winnerHorseId}</p>
            <p>순위: {raceResult.ranking?.join(", ")}</p>
          </div>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <h3>베팅 요약</h3>
        {bet.length === 0 ? (
          <p>베팅 데이터가 없습니다.</p>
        ) : (
          <ul>
            {bet.map((summary) => {
              const horse = horses.find((h) => h.horseId === summary.horseId);
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
