"use client";

import { toCurrency } from "@/helpers/string-helper";
import { PontoTendencia } from "@/types/dashboard";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AreaTendenciaProps {
  pontos: PontoTendencia[];
}

function abreviarBRL(value: number): string {
  if (value >= 1000) return `R$${(value / 1000).toFixed(0)}k`;
  return `R$${value}`;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700/80 rounded-xl px-4 py-3 shadow-2xl shadow-black/50">
      <p className="text-xs text-gray-400 mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-xs text-gray-400">{p.name === "entradas" ? "Entradas" : "Saídas"}</span>
          <span className="text-xs font-bold text-gray-100 tabular-nums ml-auto pl-4">{toCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function AreaTendencia({ pontos }: AreaTendenciaProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded-full bg-cyan-400" />
          <span className="text-xs text-gray-400">Entradas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded-full bg-purple-500" />
          <span className="text-xs text-gray-400">Saídas</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={pontos} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gradientEntradas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#52cce0" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#52cce0" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientSaidas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6759f4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6759f4" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />

          <XAxis
            dataKey="mes"
            tick={{ fill: "#85899a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={abreviarBRL}
            tick={{ fill: "#85899a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={52}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="entradas"
            stroke="#52cce0"
            strokeWidth={2}
            fill="url(#gradientEntradas)"
            dot={false}
            activeDot={{ r: 4, fill: "#52cce0", strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="saidas"
            stroke="#6759f4"
            strokeWidth={2}
            fill="url(#gradientSaidas)"
            dot={false}
            activeDot={{ r: 4, fill: "#6759f4", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
