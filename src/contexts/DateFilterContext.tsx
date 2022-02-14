import { createContext, ReactNode, useContext, useState } from "react";
import { DateRange, IDateFilterContextData } from "../types/date";
import { toUsDate } from "../utils/helpers";

interface DateFilterProviderProps {
  children: ReactNode;
}

const DateFilterContext = createContext({} as IDateFilterContextData);

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