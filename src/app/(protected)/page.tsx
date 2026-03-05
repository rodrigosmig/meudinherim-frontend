'use client';

import { Header } from "@/components/header/header";
import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import Text from "@/components/primitives/text";
import { addMonths, format, getYear, subMonths } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [dataAtual, setDataAtual] = useState(new Date());
  const mesAtual = format(dataAtual, 'LLLL', { locale: ptBR });
  const anoAtual = getYear(dataAtual);

  const handlePreviousMonth = () => {
    const newDate = subMonths(dataAtual, 1);
    setDataAtual(newDate);
  }

  const handleNextMonth = () => {
    const newDate = addMonths(dataAtual, 1);
    setDataAtual(newDate);
  }

  return (
    <div>
      <div className="mb-2 flex justify-between md:hidden">
        <PageTitle
          mes={mesAtual}
          ano={anoAtual}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
      </div>

      <Header.Title>
        <PageTitle
          mes={mesAtual}
          ano={anoAtual}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

      </Header.Title>

      <Card.Root>
        <Card.Header>
          <div className="flex items-center gap-4">
            <Text variant="heading-medium">Dashboard</Text>
          </div>
        </Card.Header>
        <Text variant="paragraph-medium">Conteúdo da dashboard</Text>

        <Card.Footer>Teste</Card.Footer>
      </Card.Root>

    </div>
  )
}

interface PageTitleProps {
  mes: string;
  ano: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

function PageTitle({ mes, ano, onPreviousMonth, onNextMonth }: PageTitleProps) {
  return (
    <>
      <Text variant="heading-large" className="first-letter:capitalize">{mes}, {ano}</Text>

      <div className="flex items-center gap-2 md:pl-2">
        <Button
          variant="icon"
          aria-label="Voltar"
          tooltip="Mês anterior"
          onClick={onPreviousMonth}
        >
          <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white" />
        </Button>
        <Button
          variant="icon"
          aria-label="Avançar"
          tooltip="Mês seguinte"
          onClick={onNextMonth}
        >
          <ChevronRight className="w-5 h-5 text-gray-400 hover:text-white" />
        </Button>
      </div>
    </>
  )
}
