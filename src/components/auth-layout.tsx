"use client";

import { cn } from "@/helpers/string-helper";
import { ChevronLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backHref?: string;
}

export function AuthLayout({ children, title, subtitle, backHref }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[460px] flex-col justify-between p-10 relative overflow-hidden border-r border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/25 via-gray-900 to-gray-900" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Meu Dinheirim</span>
        </div>

        <div className="relative z-10 space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-widest text-purple-400 uppercase">Finanças pessoais</p>
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-snug">
              Controle seu<br />
              <span className="text-primary">dinheiro</span>{" "}
              com<br />
              inteligência.
            </h1>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Gerencie contas, cartões, faturas e lançamentos em um só lugar — de forma simples e visual.
          </p>

          <div className="flex items-center gap-4 pt-2">
            {[
              { label: "Contas", value: "bancárias" },
              { label: "Cartões", value: "de crédito" },
              { label: "Relatórios", value: "detalhados" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-white text-xs font-semibold">{item.label}</p>
                <p className="text-gray-600 text-[10px]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-gray-700 text-xs">© {new Date().getFullYear()} Meu Dinheirim</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile brand mark */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Meu Dinheirim</span>
          </div>

          {/* Header */}
          <div className={cn("mb-6", backHref ? "flex items-center gap-3" : "")}>
            {backHref && (
              <Link
                href={backHref}
                aria-label="Voltar"
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
            )}
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              {subtitle && (
                <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl shadow-black/30">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
