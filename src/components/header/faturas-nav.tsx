import { useProximasFaturas } from "@/hooks/use-proximas-faturas";
import { toBrDate, toCurrency } from "@/helpers/string-helper";
import { useMobile } from "@/hooks/use-is-mobile";
import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { Fatura } from "@/types/faturas";
import Link from "next/link";

import { DropdownMenu } from "../primitives/dropdown-menu";
import { Button } from "../primitives/button";
import Text from "../primitives/text";
import Icon from "../primitives/icon";
import { Avatar } from "../avatar";

export function FaturasNav() {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [total, setTotal] = useState(0);
  const isMobile = useMobile();
  const align = isMobile ? "center" : "end";
  const avatarSize = isMobile ? 38 : 42;

  const { data, isFetching: isFetchingFaturas } = useProximasFaturas();

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

      <DropdownMenu.Content align={align}>
        <div className="px-2 text-center">
          <Text className="text-sm md:text-base font-bold">Contas</Text>
        </div>

        <div className="mt-2 space-x-3 divide-y divide-gray-800 max-h-76 overflow-y-auto overflow-x-hidden">
          {faturas.map((fatura) => (
            <DropdownMenu.Item key={fatura.uuid}>
              <Link
                href={`#`}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800 rounded-lg"
              >
                <Avatar name={fatura.cartao} size={avatarSize} />

                <div className="w-full flex items-center gap-3 px-3 py-2 text-left">
                  <div className="flex flex-col">
                    <Text variant="label-medium" className="text-xs md:text-sm font-medium">{fatura.cartao}</Text>
                    <Text className="text-xs md:text-sm font-medium">{toBrDate(fatura.dataVencimento)}</Text>
                  </div>
                  <Text className="text-xs md:text-sm font-bold">{toCurrency(fatura.valorTotal)}</Text>
                </div>
              </Link>
            </DropdownMenu.Item>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-gray-800 px-3">
          <div className="flex items-center justify-between">
            <Text className="text-xs leading-[150%] font-semibold md:text-base">Total:</Text>
            <Text className={`text-xs leading-[150%] font-semibold md:text-base text-red-400`}>{toCurrency(total)}</Text>
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
