import { FilePenLine, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { SelectItem } from "@/components/primitives/select-item";
import { Button } from "@/components/primitives/button";
import { Table } from "@/components/primitives/table";
import { Input } from "@/components/primitives/input";
import Select from "@/components/primitives/select";
import { Card } from "@/components/primitives/card";
import Pagination from "@/components/pagination";
import Text from "@/components/primitives/text";

export default function Home() {
  const thData = ["Nome", "Tipo", "Exibir na Dashboard", "Ações"];

  return (
    <Card.Root>
      <Card.Header>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4 ">
            <Select placeholder="Selecione uma opção">
              <SelectItem text="Todas" value="todas" />
              <SelectItem text="Entradas" value="entradas" />
              <SelectItem text="Saídas" value="saidas" />
            </Select>


            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox"
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-violet-600 focus:ring-violet-500" />
              <span className="text-gray-300">Ativas</span>
            </label>

          </div>

          <Button icon={Plus}>
            Adicionar
          </Button>
        </div>


        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Select value="10">
              <SelectItem text="10" value="10" />
              <SelectItem text="25" value="25" />
              <SelectItem text="50" value="50" />
              <SelectItem text="100" value="100" />
            </Select>
            <span className="hidden md:block">Resultados por página</span>
          </div>
          <div className="flex-1">
            <Input placeholder="Pesquisar" icon={Search} />
          </div>
        </div>
      </Card.Header>

      <Table.Root theadData={thData}>

        <Table.Tr>
          <Table.Td>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <Text>Alimentação (Delivery)</Text>
            </div>
          </Table.Td>
          <Table.Td>
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              Saída
            </span>
          </Table.Td>
          <Table.Td className="px-6 py-4 text-center">
            <svg className="w-5 h-5 text-blue-400 mx-auto" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M5 13l4 4L19 7" />
            </svg>
          </Table.Td>
          <Table.Td>
            <div className="flex items-center justify-end gap-2">
              <Button variant="edit" icon={FilePenLine}>

              </Button>
              <Button variant="remove"
                icon={Trash2}>

              </Button>
            </div>
          </Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Td>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-white">Cashback</span>
            </div>
          </Table.Td>
          <Table.Td>
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
              Entrada
            </span>
          </Table.Td>
          <Table.Td className="px-6 py-4 text-center">
            <svg className="w-5 h-5 text-blue-400 mx-auto" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M5 13l4 4L19 7" />
            </svg>
          </Table.Td>
          <Table.Td>
            <div className="flex items-center justify-end gap-2">
              <Button variant="edit" icon={Pencil} tooltip="Editar">

              </Button>
              <Button variant="remove"
                icon={Trash2}>

              </Button>
              <Button variant="info" tooltip="Deletar"
                icon={Trash2}>

              </Button>
              <Button
                variant="cancel"
                icon={Trash2}
                tooltip="Cancelar"
              >

              </Button>
            </div>
          </Table.Td>
        </Table.Tr>


      </Table.Root>


      <Card.Footer>
        <Pagination
          from={1}
          to={10}
          lastPage={1}
          totalRegisters={10}
          onPageChange={() => { }}
        />
      </Card.Footer>
    </Card.Root >
  );
}
