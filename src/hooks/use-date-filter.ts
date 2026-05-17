import { toStringBrDate, toUsDate } from "@/helpers/string-helper";
import { DateFilterContext } from "@/contexts/date-filter-context";
import { DateRange } from "react-day-picker";
import { useContext } from "react";

export const useDateFilter = () => {
  const {
    dateRange,
    setDateRange,
    stringDateBR,
    stringDateUS,
    setStringDateBR,
    setStringDateUS,
  } = useContext(DateFilterContext);

  const handleChangeDateFilter = (range: DateRange | undefined) => {
    setDateRange(range);

    const brDate = {
      from: range?.from ? toStringBrDate(range.from) : "",
      to: range?.to ? toStringBrDate(range.to) : "",
    };

    setStringDateBR(brDate);
  };

  const handleOnClickFilter = () => {
    const usDate = {
      from: "",
      to: "",
    };

    if (dateRange?.from && dateRange?.to) {
      usDate.from = toUsDate(dateRange.from);
      usDate.to = toUsDate(dateRange.to);
    }

    setStringDateUS(usDate);
  };

  return {
    dateRange,
    stringDateBR,
    stringDateUS,
    handleChangeDateFilter,
    handleOnClickFilter,
  };
};
