"use client";

import { SelectOption } from "@/components/primitives/select";
import { useEffect, useState } from "react";
import { useConfiguracaoInicial } from "./use-configuracao-inicial";

type UseTagsResult = {
  tags: string[];
  tagsOptions: SelectOption[];
  isLoading: boolean;
  isFetching: boolean;
};

export function useTags(): UseTagsResult {
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
