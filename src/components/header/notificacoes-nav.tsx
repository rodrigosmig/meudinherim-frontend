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

      <DropdownMenu.Content align={align} className="w-72 md:w-80">
        <div className="px-2 text-center border-b border-default-border pb-2">
          <Text variant="label-medium-bold">Notificações</Text>
        </div>

        <div className="mt-2 space-x-4 max-h-76 overflow-y-auto overflow-x-hidden divide-y divide-default-border">
          {notificacoes.map((notificacao) => (
            <DropdownMenu.Item key={notificacao.id}>
              <Link
                href={`#`}
                className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="flex flex-col">
                  <Text variant="label-small-bold">{getTipoContaAgendada(notificacao.tipo)}</Text>
                  <Text variant="label-small">{notificacao.descricao}</Text>
                  <Text variant="label-small">Vencimento: {toBrDate(notificacao.dataVencimento)}</Text>
                </div>
                <div className="ml-auto">
                  <Text variant="label-small-bold" className="text-center">{toCurrency(notificacao.valor)}</Text>
                </div>
              </Link>
            </DropdownMenu.Item>
          ))}
        </div>

        <div className="px-2 mt-2">
          <Button className="w-full">
            Marcar todas como lidas
          </Button>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}