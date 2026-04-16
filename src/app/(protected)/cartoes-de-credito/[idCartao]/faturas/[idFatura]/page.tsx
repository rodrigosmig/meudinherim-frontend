'use client'

import { useParams } from "next/navigation";

type FaturasPageProps = {}

export default function FaturasPage({ }: FaturasPageProps) {
  const params = useParams<{ idFatura: string, idCartao: string }>();
  const idFatura = params.idFatura;
  const idCartao = params.idCartao;

  return (
    <div>
      <div>{idFatura}</div>
      <div>{idCartao}</div>
    </div>
  )
}