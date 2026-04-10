"use client";

import { toCurrency } from "@/helpers/string-helper";
import { Urls } from "@/helpers/urls";
import { useContas } from "@/hooks/use-contas";
import { useMobile } from "@/hooks/use-is-mobile";
import { Conta } from "@/types/contas";
import { Landmark } from "lucide-react";
import Link from "next/link";
import { Avatar } from "../avatar";
import { Button } from "../primitives/button";
import { DropdownMenu } from "../primitives/dropdown-menu";
import Icon from "../primitives/icon";
import Loading from "../primitives/loading";
import Text from "../primitives/text";

export function ContasNav() {
  const isMobile = useMobile();
  const align = isMobile ? "center" : "end";
  const avatarSize = isMobile ? 34 : 36;

  const { contas, saldoTotal, isLoading, isFetching } = useContas();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="icon" aria-label="Contas">
          <Icon icon={Landmark} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align={align} className="w-64 md:w-72">
        {isLoading ? (
          <div className="h-36 flex justify-center items-center gap-2">
            <Loading />
            <Text variant="paragraph-small" className="text-gray-400">Carregando contas...</Text>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 px-3 py-2 border-b border-border-muted mb-1">
              <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
                <Landmark className="w-3 h-3 text-primary" />
              </div>
              <Text className="text-sm font-semibold text-gray-200">Contas</Text>
              {isFetching && <Loading className="w-3.5 h-3.5" />}
            </div>

            <div className="max-h-72 overflow-y-auto overflow-x-hidden divide-y divide-divider">
              {contas.map((conta: Conta) => (
                <DropdownMenu.Item key={conta.uuid}>
                  <Link
                    href={`${Urls.CONTAS_BANCARIAS}/${conta.uuid}/lancamentos`}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-hover rounded-lg transition-colors duration-150 group"
                  >
                    <Avatar name={conta.nome} size={avatarSize} />
                    <div className="flex-1 min-w-0">
                      <Text className="block font-medium text-gray-200 group-hover:text-white truncate">{conta.nome}</Text>
                      <Text variant="paragraph-small" className={`block font-semibold ${conta.saldo < 0 ? 'text-negative' : 'text-positive'}`}>
                        {toCurrency(conta.saldo)}
                      </Text>
                    </div>
                  </Link>
                </DropdownMenu.Item>
              ))}
            </div>

            <div className="flex items-center justify-between px-3 py-2 border-t border-border-muted mt-1">
              <Text variant="paragraph-small" className="text-gray-400 font-medium">Saldo total</Text>
              <Text className={`font-bold ${saldoTotal < 0 ? 'text-negative' : 'text-positive'}`}>
                {toCurrency(saldoTotal)}
              </Text>
            </div>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
