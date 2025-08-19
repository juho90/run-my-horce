import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./horse.module.css";

export type Horse = {
  raceId: number;
  horseId: number;
  name: string;
  runningStyle: string;
  strength: number;
  endurance: number;
  agility: number;
  intelligence: number;
  spirit: number;
};

type Column = {
  key: keyof Horse;
  label: string;
  width?: string;
  isNumber?: boolean;
};

const HorseColumns: Column[] = [
  { key: "horseId", label: "번호", width: "8%", isNumber: true },
  { key: "name", label: "이름", width: "15%" },
  { key: "runningStyle", label: "각질", width: "27%" },
  { key: "strength", label: "힘", width: "10%", isNumber: true },
  { key: "endurance", label: "지구력", width: "10%", isNumber: true },
  { key: "agility", label: "민첩성", width: "10%", isNumber: true },
  { key: "intelligence", label: "지능", width: "10%", isNumber: true },
  { key: "spirit", label: "정신력", width: "10%", isNumber: true },
];

export const HorseViewer = ({ horses: data }: { horses: Horse[] }) => {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    setHorses(data.map((h) => ({ ...h })));
  }, [data]);

  const castValue = useCallback(
    (key: keyof Horse, raw: string): string | number => {
      const numberCols: (keyof Horse)[] = [
        "horseId",
        "strength",
        "endurance",
        "agility",
        "intelligence",
        "spirit",
      ];
      if (numberCols.includes(key)) {
        return Number(raw || 0);
      }
      return raw;
    },
    []
  );

  const findHorseIndex = useCallback(
    (horseId: number) => {
      for (let i = 0; i < horses.length; i++) {
        if (horses[i].horseId === horseId) {
          return i;
        }
      }
      return null;
    },
    [horses]
  );

  const handleChange = useCallback(
    (horseId: number, key: keyof Horse, raw: string) => {
      const horseIndex = findHorseIndex(horseId);
      if (horseIndex === null) {
        return;
      }
      setHorses((prev) => {
        const copy = [...prev];
        copy[horseIndex] = {
          ...copy[horseIndex],
          [key]: castValue(key, raw),
        };
        return copy;
      });
    },
    [castValue, findHorseIndex]
  );

  const startEdit = useCallback((horseId: number) => {
    setEditingId(horseId);
  }, []);

  const cancelEdit = useCallback(() => {
    setHorses(data.map((h) => ({ ...h })));
    setEditingId(null);
  }, [data]);

  const save = useCallback(
    async (horseId: number) => {
      setSavingId(horseId);
      try {
        const horseIndex = findHorseIndex(horseId);
        if (horseIndex === null) {
          return;
        }
        const horse = horses[horseIndex];
        const res = await fetch("/api/create-horse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(horse),
        });
        if (!res.ok) {
          throw new Error("저장 실패");
        }
        setEditingId(null);
      } catch (err) {
        console.error(err);
      } finally {
        setSavingId(null);
      }
    },
    [horses, findHorseIndex]
  );

  const columns = useMemo(() => HorseColumns, []);
  const rows = horses;

  return (
    <div className={styles.container}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`${styles.cell} ${styles.header}`}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
              <th
                className={`${styles.cell} ${styles.header}`}
                style={{ width: "12%" }}
              >
                작업
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((horse) => {
              const isEditing = editingId === horse.horseId;
              const isSaving = savingId === horse.horseId;
              return (
                <tr key={horse.horseId}>
                  {columns.map((col) => {
                    const val = horse[col.key];
                    return (
                      <td key={String(col.key)} className={styles.cell}>
                        {isEditing ? (
                          <input
                            className={styles.input}
                            value={String(val ?? "")}
                            onChange={(e) =>
                              handleChange(
                                horse.horseId,
                                col.key,
                                e.target.value
                              )
                            }
                            type={col.isNumber ? "number" : "text"}
                          />
                        ) : (
                          String(val ?? "")
                        )}
                      </td>
                    );
                  })}
                  <td className={styles.cell}>
                    {!isEditing ? (
                      <button
                        onClick={() => startEdit(horse.horseId)}
                        className={styles.btn}
                        disabled={editingId !== null}
                      >
                        편집
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => save(horse.horseId)}
                          className={styles.btn}
                          disabled={isSaving}
                        >
                          {isSaving ? "저장중..." : "저장"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className={styles.btn}
                          disabled={isSaving}
                        >
                          취소
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HorseViewer;
