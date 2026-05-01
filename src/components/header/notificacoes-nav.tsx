"use client";

import { toBrDate, toCurrency } from "@/helpers/string-helper";
import { useMobile } from "@/hooks/use-is-mobile";
import { Notificacao } from "@/types/notificacoes";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useConfiguracaoInicial } from "@/hooks/use-configuracao-inicial";
import { TipoContaAgendada } from "@/types/enum/tipo-conta-agendada";
import { Button } from "../primitives/button";
import { DropdownMenu } from "../primitives/dropdown-menu";
import Icon from "../primitives/icon";
import Loading from "../primitives/loading";
import Text from "../primitives/text";

const tipoContasAgendadas = {
  [TipoContaAgendada.CONTA_A_RECEBER]: "Conta a Receber",
  [TipoContaAgendada.CONTA_A_PAGAR]: "Conta a Pagar",
};

export default function NotificacoesNav() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const isMobile = useMobile();
  const align = isMobile ? "center" : "end";

  const { data, isLoading, isFetching } = useConfiguracaoInicial();

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
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {notificacoes.length}
            </span>
          )}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align={align} className="w-72 md:w-80">
        {isLoading ? (
          <div className="h-36 flex justify-center items-center gap-2">
            <Loading />
            <Text variant="paragraph-small" className="text-gray-400">Carregando notificações...</Text>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 px-3 py-2 border-b border-border-muted mb-1">
              <div className="w-5 h-5 rounded-md bg-red-500/20 flex items-center justify-center">
                <Bell className="w-3 h-3 text-red-400" />
              </div>
              <span className="text-sm font-semibold text-gray-200">Notificações</span>
              {notificacoes.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-semibold">
                  {notificacoes.length}
                </span>
              )}
              {isFetching && <Loading className="w-3.5 h-3.5" />}
            </div>

            <div className="max-h-76 overflow-y-auto overflow-x-hidden divide-y divide-divider">
              {notificacoes.length === 0 ? (
                <div className="py-6 text-center">
                  <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <Text variant="paragraph-small" className="text-gray-500">Nenhuma notificação</Text>
                </div>
              ) : (
                notificacoes.map((notificacao) => (
                  <DropdownMenu.Item key={notificacao.id}>
                    <Link
                      href={`#`}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-hover rounded-lg transition-colors duration-150"
                    >
                      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                        <Text className="font-semibold text-gray-200 truncate">{tipoContasAgendadas[notificacao.tipo]}</Text>
                        <Text variant="paragraph-small" className="text-gray-400 truncate">{notificacao.descricao}</Text>
                        <Text variant="paragraph-small" className="text-gray-500">
                          Vence: {toBrDate(notificacao.dataVencimento)}
                        </Text>
                      </div>
                      <Text className="font-bold text-gray-200 shrink-0">{toCurrency(notificacao.valor)}</Text>
                    </Link>
                  </DropdownMenu.Item>
                ))
              )}
            </div>
          </>
        )}


        {notificacoes.length > 0 && (
          <div className="px-2 pt-2 border-t border-border-muted mt-1">
            <Button className="w-full" variant="cancel">
              Marcar todas como lidas
            </Button>
          </div>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
