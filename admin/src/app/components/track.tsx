export type Segment = {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
  length: number;
  type: string;
};

export type Track = {
  segments: Segment[];
  trackLength: number;
  raceLength: number;
  totalLaps: number;
};

export const TrackViewer = ({ track }: { track: Track }) => {
  const svgWidth = 800;
  const svgHeight = 400;
  return (
    <div style={{ marginBottom: 16 }}>
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{ border: "1px solid #ddd", backgroundColor: "#f9f9f9" }}
      >
        {track.segments.map((segment, index) => (
          <line
            key={index}
            x1={segment.start.x}
            y1={segment.start.y}
            x2={segment.end.x}
            y2={segment.end.y}
            stroke={segment.type === "straight" ? "#333" : "#666"}
            strokeWidth="3"
          />
        ))}
        {/* 시작/끝 지점 표시 */}
        {track.segments.length > 0 && (
          <circle
            cx={track.segments[0].start.x}
            cy={track.segments[0].start.y}
            r="8"
            fill="green"
          />
        )}
      </svg>
      <div style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
        <p>트랙 길이: {track.trackLength}m</p>
        <p>레이스 거리: {track.raceLength}m</p>
        <p>총 랩수: {track.totalLaps}</p>
        <p>세그먼트 수: {track.segments.length}</p>
      </div>
    </div>
  );
};
