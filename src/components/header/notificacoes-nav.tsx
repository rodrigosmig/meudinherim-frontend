"use client";

import { getTipoContaAgendada } from "@/helpers/enum/conta-agendada";
import { toBrDate, toCurrency } from "@/helpers/string-helper";
import { useMobile } from "@/hooks/use-is-mobile";
import { useNotificacoes } from "@/hooks/use-notificacoes";
import { Notificacao } from "@/types/notificacoes";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "../primitives/button";
import { DropdownMenu } from "../primitives/dropdown-menu";
import Icon from "../primitives/icon";
import Text from "../primitives/text";

type Props = {}

export default function NotificacoesNav({ }: Props) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const isMobile = useMobile();
  const align = isMobile ? "center" : "end";

  const { data, isFetching: i } = useNotificacoes();

  useEffect(() => {
    if (data) {
      setNotificacoes(data.notificacoes);
    }
  }, [data]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="icon" aria-label="Notificações">
          <Icon icon={Bell} />
          {notificacoes.length > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {notificacoes.length}
            </span>
          )}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align={align}>
        <div className="px-2 text-center">
          <Text className="text-sm md:text-base font-bold">Notificações</Text>
        </div>

        <div className="mt-2 space-x-3 divide-y divide-gray-800 max-h-76 overflow-y-auto overflow-x-hidden">
          {notificacoes.map((notificacao) => (
            <DropdownMenu.Item key={notificacao.id}>
              <Link
                href={`#`}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800 rounded-lg"
              >
                <div className="flex flex-col">
                  <Text className="text-xs md:text-sm font-bold">{getTipoContaAgendada(notificacao.tipo)}</Text>
                  <Text className="text-xs md:text-sm font-medium">{notificacao.descricao}</Text>
                  <Text className="text-xs md:text-sm font-medium">Vencimento: {toBrDate(notificacao.dataVencimento)}</Text>
                </div>
                <Text className="text-xs md:text-sm font-bold">{toCurrency(5673.22)}</Text>
              </Link>
            </DropdownMenu.Item>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-gray-800 px-3">
          <Button className="w-full">
            Marcar todas como lidas
          </Button>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}