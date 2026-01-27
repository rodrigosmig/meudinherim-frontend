export interface IDateFilterContextData {
  dateRange: [Date | null, Date | null];
  startDate: Date;
  endDate: Date;
  setDateRange: (date: [Date | null, Date | null]) => void;
  stringDateRange: [string, string];
  setStringDateRange: (date: [string, string]) => void
}

export type DateRange = [Date | null, Date | null];