'use client';

import { createContext, ReactNode, useState } from "react";
import { DateRange } from "react-day-picker";

interface StringDateRange {
  from: string;
  to: string;
}

interface DateFilterContextData {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  stringDateBR: StringDateRange;
  stringDateUS: StringDateRange;
  setStringDateBR: (date: StringDateRange) => void;
  setStringDateUS: (date: StringDateRange) => void;
}

interface DateFilterProviderProps {
  children: ReactNode;
}

export const DateFilterContext = createContext({} as DateFilterContextData);

export const DateFilterProvider = ({ children }: DateFilterProviderProps) => {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [stringDateBR, setStringDateBR] = useState<StringDateRange>({ from: '', to: '' });
  const [stringDateUS, setStringDateUS] = useState<StringDateRange>({ from: '', to: '' });

  return (
    <DateFilterContext.Provider value={{
      dateRange,
      setDateRange,
      stringDateBR,
      stringDateUS,
      setStringDateBR,
      setStringDateUS
    }}
    >
      {children}
    </DateFilterContext.Provider>
  )
}

