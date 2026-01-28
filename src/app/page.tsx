import { SectionHeader } from "@/components/sidebar/section-header";
import { FilePenLine, PenLine, Plus, Trash2 } from "lucide-react";
import { Table } from "@/components/table";
import Button from "@/components/button";
import { Card } from "@/components/card";
import Tr from "@/components/table/tr";
import Td from "@/components/table/td";

export default function Home() {
  const thData = ["Nome", "Tipo", "Exibir na Dashboard", "Ações"];
  return (
    <>
      <SectionHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/*<!-- Items per page --> */}
            <div className="flex items-center gap-2">
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="text-sm text-gray-400">Resultados por página</span>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-violet-600 focus:ring-violet-500" />
                <span className="text-gray-300">Ativas</span>
              </label>
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option>Todas</option>
                <option>Entradas</option>
                <option>Saídas</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input type="text" placeholder="Filtrar por nome da categoria"
                className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 w-80" />
              <svg className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/*<!-- Add Button --> */}
            <Button icon={Plus}>
              Adicionar
            </Button>
          </div>
        </div>

      </SectionHeader >

      <Card>

        <Table theadData={thData}>

          <Tr>
            <Td>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white">Alimentação (Delivery)</span>
              </div>
            </Td>
            <Td>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                Saída
              </span>
            </Td>
            <Td className="px-6 py-4 text-center">
              <svg className="w-5 h-5 text-blue-400 mx-auto" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 13l4 4L19 7" />
              </svg>
            </Td>
            <Td>
              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" icon={FilePenLine}>
                  Editar
                </Button>
                <Button variant="destructive"
                  icon={Trash2}>
                  Deletar
                </Button>
              </div>
            </Td>
          </Tr>

          <Tr>
            <Td>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">Cashback</span>
              </div>
            </Td>
            <Td>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                Entrada
              </span>
            </Td>
            <Td className="px-6 py-4 text-center">
              <svg className="w-5 h-5 text-blue-400 mx-auto" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 13l4 4L19 7" />
              </svg>
            </Td>
            <Td>
              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" icon={FilePenLine}>
                  Editar
                </Button>
                <Button variant="destructive"
                  icon={Trash2}>
                  Deletar
                </Button>
              </div>
            </Td>
          </Tr>


        </Table>


        <div className="border-t border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              <span className="font-medium text-white">1 - 10</span> de <span
                className="font-medium text-white">45</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                &lt;
              </button>
              <button className="px-3 py-2 text-sm bg-violet-600 text-white rounded-lg">1</button>
              <button
                className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">2</button>
              <button
                className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">...</button>
              <button
                className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">5</button>
              <button
                className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
