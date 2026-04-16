"use client";

import { toBrDate, toCurrency } from "@/helpers/string-helper";
import { useConfiguracaoInicial } from "@/hooks/use-configuracao-inicial";
import { useMobile } from "@/hooks/use-is-mobile";
import { Fatura } from "@/types/faturas";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Urls } from "@/helpers/urls";
import { Avatar } from "../avatar";
import { Button } from "../primitives/button";
import { DropdownMenu } from "../primitives/dropdown-menu";
import Icon from "../primitives/icon";
import Text from "../primitives/text";

export function FaturasNav() {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [total, setTotal] = useState(0);
  const isMobile = useMobile();
  const align = isMobile ? "center" : "end";
  const avatarSize = isMobile ? 34 : 36;

  const { data, isFetching: isFetchingFaturas } = useConfiguracaoInicial();

  useEffect(() => {
    if (data) {
      setFaturas(data.faturas);
      setTotal(data.faturas.reduce((acc, fatura) => acc + fatura.valorTotal, 0));
    }
  }, [data]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="icon" aria-label="Faturas">
          <Icon icon={CreditCard} loading={isFetchingFaturas} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align={align} className="w-72">
        <div className="flex items-center justify-center gap-2 px-3 py-2 border-b border-border-muted mb-1">
          <div className="w-5 h-5 rounded-md bg-cyan-500/20 flex items-center justify-center">
            <CreditCard className="w-3 h-3 text-cyan-400" />
          </div>
          <Text className="text-sm font-semibold text-gray-200">Faturas</Text>
        </div>

        <div className="max-h-72 overflow-y-auto overflow-x-hidden divide-y divide-divider">
          {faturas.length === 0 ? (
            <div className="py-6 text-center">
              <CreditCard className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <Text variant="paragraph-small" className="text-gray-500">Nenhuma fatura</Text>
            </div>
          ) : (
            faturas.map((fatura) => (
              <DropdownMenu.Item key={fatura.uuid}>
                <Link
                  href={`${Urls.CARTOES_DE_CREDITO}/${fatura.cartao.uuid}/faturas/${fatura.uuid}`}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-hover rounded-lg transition-colors duration-150 group"
                >
                  <Avatar name={fatura.cartao.descricao} size={avatarSize} />
                  <div className="flex-1 min-w-0">
                    <Text className="block font-medium text-gray-200 group-hover:text-white truncate">{fatura.cartao.descricao}</Text>
                    <Text variant="paragraph-small" className="block text-gray-500">
                      Vencimento: {toBrDate(fatura.dataVencimento)}
                    </Text>
                  </div>
                  <Text className={`font-bold shrink-0 ${fatura.valorTotal > 0 ? 'text-negative' : 'text-positive'}`}>
                    {toCurrency(fatura.valorTotal)}
                  </Text>
                </Link>
              </DropdownMenu.Item>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t border-border-muted mt-1">
          <Text variant="paragraph-small" className="text-gray-400 font-medium">Total em faturas</Text>
          <Text className={`font-bold ${total > 0 ? 'text-negative' : 'text-positive'}`}>
            {toCurrency(total)}
          </Text>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
