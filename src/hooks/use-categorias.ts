"use client";

import { GroupedOption } from "@/components/primitives/select";
import { Categoria } from "@/types/categoria";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { useEffect, useState } from "react";
import { useConfiguracaoInicial } from "./use-configuracao-inicial";

type UseCategoriasResult = {
  categorias: Categoria[];
  categoriasOptions: GroupedOption[];
  categoriasEntrada: Categoria[];
  categoriasSaida: Categoria[];
  isLoading: boolean;
  isFetching: boolean;
};

export function useCategorias(): UseCategoriasResult {
  const { data, isLoading, isFetching } = useConfiguracaoInicial();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasEntrada, setCategoriasEntrada] = useState<Categoria[]>([]);
  const [categoriasSaida, setCategoriasSaida] = useState<Categoria[]>([]);

  useEffect(() => {
    if (data?.categorias) {
      setCategorias(data.categorias);
      setCategoriasEntrada(
        data.categorias.filter((c) => c.tipo === TipoCategoria.ENTRADA),
      );
      setCategoriasSaida(
        data.categorias.filter((c) => c.tipo === TipoCategoria.SAIDA),
      );
    }
  }, [data]);

  function getCategoriasOptions(): GroupedOption[] {
    const entradaOptions = categoriasEntrada.map((categoria) => ({
      value: categoria.uuid,
      label: categoria.nome,
    }));

    const saidaOptions = categoriasSaida.map((categoria) => ({
      value: categoria.uuid,
      label: categoria.nome,
    }));

    return [
      { label: "Entrada", options: entradaOptions },
      { label: "Saída", options: saidaOptions },
    ];
  }

  const categoriasOptions = getCategoriasOptions();

  return {
    categorias,
    categoriasOptions: getCategoriasOptions(),
    categoriasEntrada,
    categoriasSaida,
    isLoading,
    isFetching,
  };
}
