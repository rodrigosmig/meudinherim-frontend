export const DASHBOARD_COLORS = [
  '#6759f4',
  '#52cce0',
  '#897efa',
  '#1ebad3',
  '#a49efb',
  '#2096a7',
  '#c9c4fc',
  '#217e8c',
  '#f59e0b',
  '#10b981',
];

export const RANKING_COLORS = [
  '#6759f4',
  '#7a6cf6',
  '#897efa',
  '#a49efb',
  '#c9c4fc',
];

export function getCategoryColor(sortedNames: string[], nome: string): string {
  const index = sortedNames.indexOf(nome);
  if (index === -1) return DASHBOARD_COLORS[0];
  return DASHBOARD_COLORS[index % DASHBOARD_COLORS.length];
}
