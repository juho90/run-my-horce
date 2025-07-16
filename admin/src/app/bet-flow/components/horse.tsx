export type Horse = {
  raceId: number;
  horseId: number;
  name: string;
  strength: number;
  endurance: number;
  agility: number;
  intelligence: number;
  spirit: number;
};

export const HorseViewer = ({ horses }: { horses: Horse[] }) => {
  return (
    <table
      className="horse-table"
      style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed",
      }}
    >
      <thead>
        <tr>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "center",
              width: "10%",
            }}
          >
            번호
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "center",
              width: "20%",
            }}
          >
            이름
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "center",
              width: "14%",
            }}
          >
            힘
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "center",
              width: "14%",
            }}
          >
            지구력
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "center",
              width: "14%",
            }}
          >
            민첩성
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "center",
              width: "14%",
            }}
          >
            지능
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "center",
              width: "14%",
            }}
          >
            정신력
          </th>
        </tr>
      </thead>
      <tbody>
        {horses.map((horse) => (
          <tr key={horse.horseId}>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {horse.horseId}
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {horse.name}
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {horse.strength}
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {horse.endurance}
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {horse.agility}
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {horse.intelligence}
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {horse.spirit}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
