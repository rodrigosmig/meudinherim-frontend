"use client";

import { getCategoryColor } from "@/helpers/dashboard-colors";
import { toCurrency } from "@/helpers/string-helper";
import { CategoriaValor } from "@/types/dashboard";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  dados: CategoriaValor[];
  titulo: string;
  accentColor: string;
}

export function DonutChart({ dados, titulo, accentColor }: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visiveis = dados.filter((d) => d.exibirNaDashboard);
  const total = visiveis.reduce((sum, d) => sum + d.valor, 0);
  const sortedNames = [...visiveis]
    .sort((a, b) => a.categoriaNome.localeCompare(b.categoriaNome))
    .map((d) => d.categoriaNome);
  const activeItem = activeIndex !== null ? visiveis[activeIndex] : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
        <h3 className="text-sm font-semibold text-gray-200">{titulo}</h3>
      </div>

      <div className="relative flex-1 min-h-50">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={visiveis}
              dataKey="valor"
              nameKey="categoriaNome"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
              animationBegin={0}
              animationDuration={900}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {visiveis.map((entry, index) => (
                <Cell
                  key={entry.categoriaUuid}
                  fill={getCategoryColor(sortedNames, entry.categoriaNome)}
                  stroke="transparent"
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4">
          {activeItem ? (
            <>
              <p className="text-[9px] md:text-[8px] lg:text-[9px] text-gray-400 mb-0.5 truncate w-full text-center leading-tight">
                {activeItem.categoriaNome}
              </p>
              <p className="text-sm md:text-xs lg:text-sm font-bold text-gray-100 tabular-nums leading-tight text-center">
                {toCurrency(activeItem.valor)}
              </p>
              <p className="text-[9px] md:text-[8px] text-gray-500 mt-0.5">
                {activeItem.percentual.toFixed(1)}%
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] md:text-[8px] lg:text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">
                Total
              </p>
              <p className="text-base md:text-xs lg:text-sm font-bold text-gray-100 tabular-nums leading-tight text-center">
                {toCurrency(total)}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
        {visiveis.map((item, index) => (
          <div
            key={item.categoriaUuid}
            className="flex items-center gap-2 transition-opacity duration-150"
            style={{ opacity: activeIndex === null || activeIndex === index ? 1 : 0.35 }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: getCategoryColor(sortedNames, item.categoriaNome) }}
            />
            <span className="text-xs text-gray-400 truncate flex-1">{item.categoriaNome}</span>
            <span className="text-xs font-medium text-gray-300 tabular-nums shrink-0">
              {item.percentual.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
