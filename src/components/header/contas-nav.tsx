"use client";

import Avatar from "@/components/avatar";
import { toCurrency } from "@/helpers/string-helper";
import { useContas } from "@/hooks/use-contas";
import { Conta } from "@/types/contas";
import { Landmark } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "../primitives/button";
import Text from "../primitives/text";

type Account = {
  id: string;
  name: string;
  balance: number;
};

const mockAccounts: Account[] = [
  { id: "1", name: "Conta Corrente", balance: 1234.56 },
  { id: "2", name: "Poupança", balance: 9876.54 },
  { id: "3", name: "Cartão", balance: -250.75 },
];

export function ContasNav() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const { data, isFetching: isFetchingContas } = useContas();

  useEffect(() => {
    if (data) {
      setContas(data.contas);
      setTotal(data.contas.reduce((acc, conta) => acc + conta.saldo, 0));
    }
  }, [data]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", onDoc);

    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="icon"
        aria-label="Contas"
        onClick={() => setIsOpen((s) => !s)}
      >
        <Landmark className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
      </Button>

      {isOpen && (
        <div className="absolute -right-6 mt-2 w-64 md:w-80 rounded-lg border border-gray-800 bg-gray-900 shadow-lg z-50 p-2">
          <div className="px-2 text-center">
            <Text variant="heading-small">Contas</Text>
          </div>

          <div className="mt-2 space-x-3 divide-y divide-gray-800 max-h-76 overflow-y-auto overflow-x-hidden">
            {contas.map((conta: Conta) => (
              <Link
                key={conta.uuid}
                href={`#`}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800 rounded-lg divide-y divide-gray-800"
              >
                <Avatar name={conta.nome} size={48} bg="#1f2937" color="#fff" />

                <div className="flex-1">
                  <div className="flex flex-col">
                    <Text className="text-xs leading-[150%] font-semibold md:text-base">{conta.nome}</Text>
                    <Text className={`text-xs leading-[150%] font-semibold md:text-base mt-1 ${conta.saldo < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {toCurrency(conta.saldo)}
                    </Text>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-800 px-3">
            <div className="flex items-center justify-between">
              <Text className="text-xs leading-[150%] font-semibold md:text-base">Total:</Text>
              <Text className={`text-xs leading-[150%] font-semibold md:text-base ${total < 0 ? 'text-red-400' : 'text-green-400'}`}>{toCurrency(total)}</Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
