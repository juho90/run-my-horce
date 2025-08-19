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

const CellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center" as const,
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
          <th style={{ ...CellStyle, width: "8%" }}>번호</th>
          <th style={{ ...CellStyle, width: "15%" }}>이름</th>
          <th style={{ ...CellStyle, width: "27%" }}>각질</th>
          <th style={{ ...CellStyle, width: "10%" }}>힘</th>
          <th style={{ ...CellStyle, width: "10%" }}>지구력</th>
          <th style={{ ...CellStyle, width: "10%" }}>민첩성</th>
          <th style={{ ...CellStyle, width: "10%" }}>지능</th>
          <th style={{ ...CellStyle, width: "10%" }}>정신력</th>
        </tr>
      </thead>
      <tbody>
        {horses.map((horse) => (
          <tr key={horse.horseId}>
            <td style={CellStyle}>{horse.horseId}</td>
            <td style={CellStyle}>{horse.name}</td>
            <td style={CellStyle}>{horse.runningStyle}</td>
            <td style={CellStyle}>{horse.strength}</td>
            <td style={CellStyle}>{horse.endurance}</td>
            <td style={CellStyle}>{horse.agility}</td>
            <td style={CellStyle}>{horse.intelligence}</td>
            <td style={CellStyle}>{horse.spirit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
