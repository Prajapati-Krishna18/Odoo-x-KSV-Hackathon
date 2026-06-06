"use client";

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export function KPICard({
  label, value, trend, trendText, color, bg, icon: Icon, href,
}: {
  label: string; value: string; trend?: "up" | "down" | "stable"; trendText?: string;
  color: string; bg: string; icon: React.ElementType; href?: string;
}) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
      className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${href ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`rounded-lg ${bg} p-2.5 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && trendText && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trend === "up" && <ArrowUpRight className="h-3.5 w-3.5 text-red-500" />}
          {trend === "down" && <ArrowDownRight className="h-3.5 w-3.5 text-emerald-500" />}
          {trend === "stable" && <Minus className="h-3.5 w-3.5 text-amber-500" />}
          <span className={
            trend === "up" ? "text-red-600" : trend === "down" ? "text-emerald-600" : "text-amber-600"
          }>{trendText}</span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
    </Tag>
  );
}

export function PieChart({
  segments, size = 160, strokeWidth = 24,
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
            strokeDasharray={arc.dash} strokeDashoffset={arc.dashOffset} strokeLinecap="round" className="transition-all duration-700 ease-out" />
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

export function LineChartSimple({
  data, lines, width = 500, height = 180,
  padding = { top: 15, right: 15, bottom: 25, left: 35 },
}: {
  data: { month: string; [key: string]: number | string }[];
  lines: { key: string; label: string; color: string }[];
  width?: number; height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
}) {
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const allValues = data.flatMap((d) => lines.map((l) => Number(d[l.key])));
  const minY = Math.min(...allValues) - 5;
  const maxY = Math.max(...allValues) + 5;
  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => padding.top + chartH - ((v - minY) / (maxY - minY)) * chartH;

  return (
    <div className="relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const val = minY + p * (maxY - minY);
          const y = padding.top + chartH - p * chartH;
          return (<g key={p}><line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#f1f5f9" strokeWidth={1} /><text x={padding.left - 6} y={y + 3} textAnchor="end" className="fill-slate-400 text-[9px]">{Math.round(val)}</text></g>);
        })}
        {data.map((d, i) => (<text key={i} x={xScale(i)} y={height - 4} textAnchor="middle" className="fill-slate-400 text-[9px]">{d.month}</text>))}
        {lines.map((line) => {
          const pts = data.map((d, i) => `${xScale(i)},${yScale(Number(d[line.key]))}`).join(" ");
          return (<g key={line.key}><polyline points={pts} fill="none" stroke={line.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" className="transition-all duration-500" />{data.map((d, i) => (<circle key={i} cx={xScale(i)} cy={yScale(Number(d[line.key]))} r={3} fill="white" stroke={line.color} strokeWidth={2.5} className="hover:r-5 transition-all cursor-pointer"><title>{`${line.label}: ${d[line.key]}`}</title></circle>))}</g>);
        })}
      </svg>
      <div className="flex justify-center gap-4 mt-1">
        {lines.map((l) => (<div key={l.key} className="flex items-center gap-1 text-xs"><span className="h-2 w-4 rounded-sm" style={{ backgroundColor: l.color }} /><span className="text-slate-500">{l.label}</span></div>))}
      </div>
    </div>
  );
}

export function AreaChartSimple({
  data, lines, width = 500, height = 180,
  padding = { top: 15, right: 15, bottom: 25, left: 35 },
}: {
  data: { month: string; [key: string]: number | string }[];
  lines: { key: string; label: string; color: string }[];
  width?: number; height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
}) {
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const allValues = data.flatMap((d) => lines.map((l) => Number(d[l.key])));
  const minY = 0;
  const maxY = Math.max(...allValues) + 10;
  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => padding.top + chartH - ((v - minY) / (maxY - minY)) * chartH;

  return (
    <div className="relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const val = minY + p * (maxY - minY);
          const y = padding.top + chartH - p * chartH;
          return (<g key={p}><line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#f1f5f9" strokeWidth={1} /><text x={padding.left - 6} y={y + 3} textAnchor="end" className="fill-slate-400 text-[9px]">{Math.round(val)}</text></g>);
        })}
        {data.map((d, i) => (<text key={i} x={xScale(i)} y={height - 4} textAnchor="middle" className="fill-slate-400 text-[9px]">{d.month}</text>))}
        {lines.map((line) => {
          const pts = data.map((d, i) => `${xScale(i)},${yScale(Number(d[line.key]))}`).join(" ");
          return (<g key={line.key}>
            <polyline points={pts} fill="none" stroke={line.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {data.map((d, i) => (<circle key={i} cx={xScale(i)} cy={yScale(Number(d[line.key]))} r={3} fill="white" stroke={line.color} strokeWidth={2.5}><title>{`${line.label}: ${d[line.key]}`}</title></circle>))}
          </g>);
        })}
      </svg>
      <div className="flex justify-center gap-4 mt-1">
        {lines.map((l) => (<div key={l.key} className="flex items-center gap-1 text-xs"><span className="h-2 w-4 rounded-sm" style={{ backgroundColor: l.color }} /><span className="text-slate-500">{l.label}</span></div>))}
      </div>
    </div>
  );
}

export function HorizontalBarChart({
  bars,
}: {
  bars: { label: string; value: number; color: string; subtitle?: string }[];
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
              <span className="font-semibold text-slate-900">{bar.value}</span>
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
