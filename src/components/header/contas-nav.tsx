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
import Icon from "../primitives/icon";
import Text from "../primitives/text";

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
          <Icon icon={Landmark} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align={align} className="w-64 md:w-72">
        <div className="px-2 text-center border-b border-default-border pb-2">
          <Text variant="label-medium-bold">Contas</Text>
        </div>

        <div className="mt-2 space-x-3 max-h-76 overflow-y-auto overflow-x-hidden divide-y divide-default-border">
          {contas.map((conta: Conta) => (
            <DropdownMenu.Item key={conta.uuid}>
              <Link
                href={`#`}
                className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-800 rounded-lg"
              >
                <Avatar name={conta.nome} size={avatarSize} />

                <div className="flex-1">
                  <div className="flex flex-col">
                    <Text variant="label-small-bold">{conta.nome}</Text>
                    <Text variant="label-small" className={`md:text-sm mt-1 ${conta.saldo < 0 ? 'text-red-400' : 'text-cyan-400'}`}>
                      {toCurrency(conta.saldo)}
                    </Text>
                  </div>
                </div>
              </Link>
            </DropdownMenu.Item>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-default-border px-3">
          <div className="flex items-center justify-between">
            <Text variant="label-medium-bold">Total:</Text>
            <Text variant="label-medium-bold" className={`${total < 0 ? 'text-red-400' : 'text-cyan-400'}`}>{toCurrency(total)}</Text>
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
