"use client";

import type { RiskTrendPoint } from "@/lib/risk-store";

export function DonutChart({
  segments,
  size = 180,
  strokeWidth = 28,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
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
          <circle
            key={arc.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={arc.dash}
            strokeDashoffset={arc.dashOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          >
            <animate
              attributeName="stroke-dashoffset"
              from={circumference}
              to={arc.dashOffset}
              dur="1s"
              fill="freeze"
            />
          </circle>
        ))}
      </svg>
      <div className="flex flex-wrap justify-center gap-4 mt-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-slate-600">{seg.label}</span>
            <span className="font-semibold text-slate-900">{Math.round((seg.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({
  data,
  lines,
  width = 600,
  height = 220,
  padding = { top: 20, right: 20, bottom: 30, left: 40 },
}: {
  data: RiskTrendPoint[];
  lines: { key: keyof RiskTrendPoint; label: string; color: string }[];
  width?: number;
  height?: number;
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
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeWidth={1} />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-slate-400 text-[10px]">
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => (
          <text
            key={i}
            x={xScale(i)}
            y={height - 4}
            textAnchor="middle"
            className="fill-slate-400 text-[10px]"
          >
            {d.month}
          </text>
        ))}

        {lines.map((line) => {
          const pts = data.map((d, i) => `${xScale(i)},${yScale(Number(d[line.key]))}`).join(" ");

          return (
            <g key={line.key}>
              <polyline
                points={pts}
                fill="none"
                stroke={line.color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              {data.map((d, i) => (
                <circle
                  key={i}
                  cx={xScale(i)}
                  cy={yScale(Number(d[line.key]))}
                  r={3.5}
                  fill="white"
                  stroke={line.color}
                  strokeWidth={2.5}
                  className="hover:r-5 transition-all cursor-pointer"
                >
                  <title>{`${line.label}: ${d[line.key]}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
      <div className="flex justify-center gap-6 mt-1">
        {lines.map((l) => (
          <div key={l.key} className="flex items-center gap-1.5 text-xs">
            <span className="h-2.5 w-5 rounded-sm" style={{ backgroundColor: l.color }} />
            <span className="text-slate-600">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarChart({
  bars,
  height = 200,
}: {
  bars: { label: string; value: number; color: string; subtitle?: string }[];
  height?: number;
}) {
  const maxVal = Math.max(...bars.map((b) => b.value));

  return (
    <div className="space-y-3">
      {bars.map((bar) => {
        const pct = (bar.value / maxVal) * 100;
        return (
          <div key={bar.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">{bar.label}</span>
              <span className="font-semibold text-slate-900">{bar.value}%</span>
            </div>
            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%`, backgroundColor: bar.color }}
              >
                <animate
                  attributeName="width"
                  from="0"
                  to={`${pct}%`}
                  dur="0.8s"
                  fill="freeze"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
