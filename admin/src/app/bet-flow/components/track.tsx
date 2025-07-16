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
  width: number;
  height: number;
  segments: Segment[];
  trackLength: number;
  raceLength: number;
  totalLaps: number;
};

export const TrackViewer = ({ track }: { track: Track }) => {
  const scale = 0.5;
  const svgWidth = track.width * scale;
  const svgHeight = track.height * scale;
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
            x1={segment.start.x * scale}
            y1={segment.start.y * scale}
            x2={segment.end.x * scale}
            y2={segment.end.y * scale}
            stroke={segment.type === "straight" ? "#333" : "#666"}
            strokeWidth="3"
          />
        ))}
        {/* 시작/끝 지점 표시 */}
        {track.segments.length > 0 && (
          <circle
            cx={track.segments[0].start.x * scale}
            cy={track.segments[0].start.y * scale}
            r="8"
            fill="green"
          />
        )}
      </svg>
      <div style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
        <p>
          트랙 크기: {track.width} x {track.height}
        </p>
        <p>트랙 길이: {track.trackLength}m</p>
        <p>레이스 거리: {track.raceLength}m</p>
        <p>총 랩수: {track.totalLaps}</p>
        <p>세그먼트 수: {track.segments.length}</p>
      </div>
    </div>
  );
};
