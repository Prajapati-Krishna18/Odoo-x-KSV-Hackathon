"use client";

export function Sparkline({ data, color = "#2563eb", width = 80, height = 32 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MiniBar({ data, color = "#2563eb", width = 80, height = 32 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data, 1);
  const barW = width / data.length - 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((v, i) => (
        <rect key={i} x={i * (barW + 2) + 1} y={height - (v / max) * height} width={barW} height={(v / max) * height} rx={2} fill={color} fillOpacity={0.7} />
      ))}
    </svg>
  );
}

export function LineChart({
  data, lines, width = 500, height = 200,
  padding = { top: 20, right: 20, bottom: 30, left: 40 },
}: {
  data: { month: string; [key: string]: number | string }[];
  lines: { key: string; label: string; color: string }[];
  width?: number; height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
}) {
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const allValues = data.flatMap((d) => lines.map((l) => Number(d[l.key])));
  const minY = Math.min(...allValues) - 10;
  const maxY = Math.max(...allValues) + 10;
  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => padding.top + chartH - ((v - minY) / (maxY - minY)) * chartH;
  const yTicks = 5;
  const yStep = (maxY - minY) / yTicks;

  return (
    <div className="relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const val = minY + i * yStep;
          const y = yScale(val);
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#f1f5f9" strokeWidth={1} />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-slate-400 text-[10px]">
                {Math.round(val / 1000)}k
              </text>
            </g>
          );
        })}
        {data.map((d, i) => (
          <text key={i} x={xScale(i)} y={height - 4} textAnchor="middle" className="fill-slate-400 text-[10px]">{d.month}</text>
        ))}
        {lines.map((line) => {
          const pts = data.map((d, i) => `${xScale(i)},${yScale(Number(d[line.key]))}`).join(" ");
          return (
            <g key={line.key}>
              <polyline points={pts} fill="none" stroke={line.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
              {data.map((d, i) => (
                <circle key={i} cx={xScale(i)} cy={yScale(Number(d[line.key]))} r={3} fill="white" stroke={line.color} strokeWidth={2}>
                  <title>{`${line.label}: ₹${(Number(d[line.key]) / 1000).toFixed(1)}k`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function BarChart({
  bars,
}: {
  bars: { label: string; value: number; color: string }[];
}) {
  const maxVal = Math.max(...bars.map((b) => b.value), 1);
  return (
    <div className="space-y-3">
      {bars.map((bar) => {
        const pct = Math.max((bar.value / maxVal) * 100, 2);
        return (
          <div key={bar.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">{bar.label}</span>
              <span className="font-semibold text-slate-900">{bar.value}/100</span>
            </div>
            <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: bar.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PieChart({
  segments, size = 140, strokeWidth = 22,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number; strokeWidth?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const circumference = 2 * Math.PI * r;

  const arcs = segments.map((seg, i) => {
    const fraction = seg.value / total;
    const length = fraction * circumference;
    const cumulativeOffset = segments.slice(0, i).reduce((sum, s) => sum + (s.value / total) * circumference, 0);
    return { ...seg, dash: `${length} ${circumference - length}`, dashOffset: -cumulativeOffset };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        {arcs.map((arc) => (
          <circle key={arc.label} cx={cx} cy={cy} r={r} fill="none" stroke={arc.color} strokeWidth={strokeWidth}
            strokeDasharray={arc.dash} strokeDashoffset={arc.dashOffset} strokeLinecap="round" className="transition-all duration-700 ease-out">
            <animate attributeName="stroke-dashoffset" from={circumference} to={arc.dashOffset} dur="0.8s" fill="freeze" />
          </circle>
        ))}
      </svg>
    </div>
  );
}
