import { createContext, ReactNode, useContext, useState } from "react";
import { toUsDate } from "../utils/helpers";

type DateRange = [Date | null, Date | null];

type DateFilterContextData = {
  dateRange: [Date | null, Date | null];
  startDate: Date;
  endDate: Date;
  setDateRange: (date: [Date | null, Date | null]) => void;
  stringDateRange: [string, string];
  setStringDateRange: (date: [string, string]) => void
}

interface DateFilterProviderProps {
  children: ReactNode;
}

const DateFilterContext = createContext({} as DateFilterContextData);

export const DateFilterProvider = ({ children }: DateFilterProviderProps) => {
  const [dateRange, setDateRange] = useState<DateRange>([null, null]);
  const [stringDateRange, setStringDateRange] = useState<[string, string]>(['', '']);
  const [startDate, endDate] = dateRange;

  return (
    <DateFilterContext.Provider value={{
        dateRange,
        startDate,
        endDate,
        setDateRange,
        stringDateRange,
        setStringDateRange
      }}
    >
      { children }
    </DateFilterContext.Provider>
  )
}

export const useDateFilter = () => {
  const {
    dateRange,
    startDate,
    endDate,
    setDateRange,
    stringDateRange,
    setStringDateRange
  } = useContext(DateFilterContext);

  const handleDateFilter = () => {    
    if (dateRange[0] && dateRange[1]) {
      setStringDateRange([toUsDate(dateRange[0]), toUsDate(dateRange[1])])
    } else {
      setStringDateRange(['', ''])
    }
  }

  return {
    dateRange,
    startDate,
    endDate,
    stringDateRange,
    setDateRange,
    handleDateFilter
  }
}