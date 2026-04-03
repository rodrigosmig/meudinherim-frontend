"use client";

import { useEffect, useState } from "react";
import { useConfiguracaoInicial } from "./use-configuracao-inicial";

export function useTags() {
  const { data, isLoading, isFetching } = useConfiguracaoInicial();
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (data?.tags) {
      setTags(data.tags);
    }
  }, [data]);

  return {
    tags,
    tagsOptions: tags.map((tag) => ({ value: tag, label: tag })),
    isLoading,
    isFetching,
  };
}
