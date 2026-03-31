import { useConfiguracaoInicial } from "@/hooks/use-configuracao-inicial";
import { toBrDate, toCurrency } from "@/helpers/string-helper";
import { useMobile } from "@/hooks/use-is-mobile";
import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { Fatura } from "@/types/faturas";
import Link from "next/link";

import { DropdownMenu } from "../primitives/dropdown-menu";
import { Button } from "../primitives/button";
import Heading from "../primitives/heading";
import Text from "../primitives/text";
import Icon from "../primitives/icon";
import { Avatar } from "../avatar";

export function FaturasNav() {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [total, setTotal] = useState(0);
  const isMobile = useMobile();
  const align = isMobile ? "end" : "center";
  const avatarSize = isMobile ? 38 : 42;

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
          <Icon icon={CreditCard} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align={"end"} className="w-72">
        <div className="px-2 text-center border-b border-default-border pb-2">
          <Heading variant="heading4">Faturas</Heading>
        </div>

        <div className="mt-2 space-x-3 max-h-76 overflow-y-auto overflow-x-hidden divide-y divide-default-border">
          {faturas.map((fatura) => (
            <DropdownMenu.Item key={fatura.uuid}>
              <Link
                href={`#`}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800 rounded-lg"
              >
                <Avatar name={fatura.cartao} size={avatarSize} />

                <div className="w-full flex items-center py-1 text-left">
                  <div className="flex flex-col">
                    <Text>{fatura.cartao}</Text>
                    <Text>{toBrDate(fatura.dataVencimento)}</Text>
                  </div>
                  <div className="ml-auto">
                    <Text className="font-bold">{toCurrency(fatura.valorTotal)}</Text>
                  </div>
                </div>
              </Link>
            </DropdownMenu.Item>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-default-border px-3">
          <div className="flex items-center justify-between">
            <Text className="font-bold">Total:</Text>
            <Text className={`font-bold ${total > 0 ? "text-negative" : "text-positive"}`}>{toCurrency(total)}</Text>
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
