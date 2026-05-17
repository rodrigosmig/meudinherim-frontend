"use client";

import { debounce } from "@/helpers/utils";
import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useMobile(
  breakpoint: number = MOBILE_BREAKPOINT,
  debounceWait: number = 150,
): boolean {
  const checkIsMobile = (): boolean => {
    if (typeof window !== "undefined") {
      return window.innerWidth < breakpoint;
    }
    return false;
  };

  const [isMobile, setIsMobile] = useState<boolean>(checkIsMobile);

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(checkIsMobile());
    };

    const debouncedHandleResize = debounce(handleResize, debounceWait);

    handleResize();
    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [breakpoint, debounceWait]);

  return isMobile;
}
