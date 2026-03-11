"use client";

import { toCurrency } from "@/helpers/string-helper";
import { useContas } from "@/hooks/use-contas";
import { useMobile } from "@/hooks/use-is-mobile";
import { Conta } from "@/types/contas";
import { Landmark } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar } from "../avatar";
import { Button } from "../primitives/button";
import { DropdownMenu } from "../primitives/dropdown-menu";
import Text from "../primitives/text";

type Account = {
  id: string;
  name: string;
  balance: number;
};

export function ContasNav() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [total, setTotal] = useState(0);
  const isMobile = useMobile();
  const align = isMobile ? "center" : "end";
  const avatarSize = isMobile ? 38 : 42;

  const { data, isFetching: isFetchingContas } = useContas();

  useEffect(() => {
    if (data) {
      setContas(data.contas);
      setTotal(data.contas.reduce((acc, conta) => acc + conta.saldo, 0));
    }
  }, [data]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="icon" aria-label="Contas">
          <Landmark className="w-4 md:w-5 h-4 md:h-5 text-gray-400" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align={align}>
        <div className="px-2 text-center">
          <Text variant="heading-small">Contas</Text>
        </div>

        <div className="mt-2 space-x-3 divide-y divide-gray-800 max-h-76 overflow-y-auto overflow-x-hidden">
          {contas.map((conta: Conta) => (
            <DropdownMenu.Item key={conta.uuid}>
              <Link
                href={`#`}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800 rounded-lg"
              >
                <Avatar name={conta.nome} size={avatarSize} />

                <div className="flex-1">
                  <div className="flex flex-col">
                    <Text variant="paragraph-small" className="md:text-sm">{conta.nome}</Text>
                    <Text variant="paragraph-small" className={`md:text-sm mt-1 ${conta.saldo < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {toCurrency(conta.saldo)}
                    </Text>
                  </div>
                </div>
              </Link>
            </DropdownMenu.Item>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-gray-800 px-3">
          <div className="flex items-center justify-between">
            <Text className="text-xs leading-[150%] font-semibold md:text-base">Total:</Text>
            <Text className={`text-xs leading-[150%] font-semibold md:text-base ${total < 0 ? 'text-red-400' : 'text-green-400'}`}>{toCurrency(total)}</Text>
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
