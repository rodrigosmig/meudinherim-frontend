"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type HeaderContextType = {
  headerTitleContent: ReactNode;
  setHeaderTitleContent: (node: ReactNode) => void;
};

const HeaderContext = createContext<HeaderContextType>({} as HeaderContextType);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerTitleContent, setHeaderTitleContent] = useState<ReactNode>(null);

  const value = useMemo(() => ({ headerTitleContent, setHeaderTitleContent }), [headerTitleContent]);

  return <HeaderContext.Provider value={value}>
    {children}
  </HeaderContext.Provider>;
}

export const useHeader = () => useContext(HeaderContext);

export function HeaderSlot({ children }: { children: ReactNode }) {
  const { setHeaderTitleContent } = useHeader();

  useEffect(() => {
    setHeaderTitleContent(children);

    return () => setHeaderTitleContent(null);
  }, [children, setHeaderTitleContent]);

  return null;
}
