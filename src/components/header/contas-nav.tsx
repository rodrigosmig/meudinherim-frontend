"use client";

import { toCurrency } from "@/helpers/string-helper";
import { useContas } from "@/hooks/use-contas";
import { useMobile } from "@/hooks/use-is-mobile";
import { Conta } from "@/types/contas";
import { Landmark } from "lucide-react";
import Link from "next/link";
import { Avatar } from "../avatar";
import { Button } from "../primitives/button";
import { DropdownMenu } from "../primitives/dropdown-menu";
import Heading from "../primitives/heading";
import Icon from "../primitives/icon";
import Text from "../primitives/text";

export function ContasNav() {
  const isMobile = useMobile();
  const align = isMobile ? "center" : "end";
  const avatarSize = isMobile ? 38 : 42;

  const { contas, saldoTotal, isLoading, isFetching } = useContas();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="icon" aria-label="Contas">
          <Icon icon={Landmark} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align={align} className="w-64 md:w-72">
        <div className="px-2 text-center border-b border-line-separator pb-2">
          <Heading variant="heading4">Contas</Heading>
        </div>

        <div className="mt-2 space-x-3 max-h-76 overflow-y-auto overflow-x-hidden divide-y divide-line-separator">
          {contas.map((conta: Conta) => (
            <DropdownMenu.Item key={conta.uuid}>
              <Link
                href={`/contas/${conta.uuid}/lancamentos`}
                className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-800 rounded-lg"
              >
                <Avatar name={conta.nome} size={avatarSize} />

                <div className="flex-1">
                  <div className="flex flex-col">
                    <Text className="font-bold">{conta.nome}</Text>
                    <Text className={`md:text-sm mt-1 ${conta.saldo < 0 ? 'text-negative' : 'text-cyan-400'}`}>
                      {toCurrency(conta.saldo)}
                    </Text>
                  </div>
                </div>
              </Link>
            </DropdownMenu.Item>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-line-separator px-3">
          <div className="flex items-center justify-between">
            <Text className="font-bold">Total:</Text>
            <Text className={`font-bold ${saldoTotal < 0 ? 'text-negative' : 'text-cyan-400'}`}>{toCurrency(saldoTotal)}</Text>
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
