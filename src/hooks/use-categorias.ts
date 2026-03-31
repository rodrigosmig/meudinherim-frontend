"use client";

import { Categoria } from "@/types/categoria";
import { TipoCategoria } from "@/types/enum/tipo-categoria";
import { useEffect, useState } from "react";
import { useConfiguracaoInicial } from "./use-configuracao-inicial";

export function useCategorias() {
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

  return {
    categorias,
    categoriasEntrada,
    categoriasSaida,
    isLoading,
    isFetching,
  };
}
