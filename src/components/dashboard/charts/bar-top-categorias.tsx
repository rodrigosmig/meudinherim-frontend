"use client";

import { RANKING_COLORS } from "@/helpers/dashboard-colors";
import { toCurrency } from "@/helpers/string-helper";
import { TopCategoriaSaida } from "@/types/dashboard";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BarTopCategoriasProps {
  top10: TopCategoriaSaida[];
}

interface TooltipPayload {
  value: number;
  payload: TopCategoriaSaida;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-gray-900 border border-gray-700/80 rounded-xl px-3 py-2.5 shadow-2xl shadow-black/50">
      <p className="text-xs text-gray-400 mb-0.5">{item.payload.categoriaNome}</p>
      <p className="text-sm font-bold text-gray-100 tabular-nums">{toCurrency(item.value)}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">{item.payload.percentualDoTotal.toFixed(1)}% do total</p>
    </div>
  );
}

export function BarTopCategorias({ top10 }: BarTopCategoriasProps) {
  const height = top10.length * 32 + 24;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        layout="vertical"
        data={top10}
        margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
        barSize={14}
      >
        <XAxis
          type="number"
          tickFormatter={(v: number) => (v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`)}
          tick={{ fill: "#85899a", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="categoriaNome"
          tick={{ fill: "#ababb7", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={100}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="valor" radius={[0, 6, 6, 0] as [number, number, number, number]}>
          {top10.map((_, index) => (
            <Cell key={index} fill={RANKING_COLORS[index % RANKING_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
