import { cn } from "@/helpers/utils";

import Text from "./primitives/text";

interface LogoProps {
  collapsed?: boolean;
}

export default function Logo({ collapsed = false }: LogoProps) {
  return (
    <div className={cn("border-b border-gray-800", collapsed ? "p-4" : "p-6")}>
      <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
        <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <Text variant="heading-medium">Meu Dinheirim</Text>
            <Text variant="paragraph-small" className="text-gray-400">Controle Financeiro</Text>
          </div>
        )}
      </div>
    </div>
  )
}