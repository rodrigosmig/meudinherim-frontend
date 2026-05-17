export interface IDashboardResponse {
  months: string[];
  total: {
      income: number;
      expense: number;
      invoices: number;
  },
  pieChart: {
      income_category: {
          value: number,
          label: string
      }[],
      expense_category: {
          value: number,
          label: string
      }[],
      card_expense_category: {
          value: number,
          label: string
      }[],
  },
  barChart: {
      income: number[];
      expense: number[];
  },
  lineChart: {
      invoices: {
          name: string;
          data: number[];
      }[]
  }
}