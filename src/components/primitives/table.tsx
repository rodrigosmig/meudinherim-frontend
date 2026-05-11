import { cn } from '@/helpers/string-helper';
import React, { ComponentProps } from 'react';

interface TableProps {
  theadData: string[];
  children: React.ReactNode;
}

export function TableRoot({ theadData, children }: TableProps) {
  return (
    <div className="overflow-x-auto border border-border-muted">
      <table className="w-full">
        <Header theadData={theadData} />
        <tbody className="divide-y divide-divider">
          {children}
        </tbody>
      </table>
    </div>
  )
}

interface HeaderProps extends ComponentProps<'thead'> {
  className?: string
  theadData: string[];
}

function Header({ className, theadData, ...props }: HeaderProps) {
  return (
    <thead className={cn("bg-surface-muted", className)} {...props}>
      <tr className="border-b border-divider">
        {theadData.map(head => (
          <th key={head} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {head}
          </th>
        ))}
      </tr>
    </thead>
  )
}

interface TrProps extends ComponentProps<'tr'> {
  className?: string;
}

function Tr({ className, ...props }: TrProps) {
  return (
    <tr className={cn("transition-colors duration-150 hover:bg-surface-hover", className)} {...props} />
  )
}

interface TdProps extends ComponentProps<'td'> {
  className?: string;
}

function Td({ className, ...props }: TdProps) {
  return (
    <td className={cn("px-6 py-3.5", className)} {...props} />
  )
}

export const Table = {
  Root: TableRoot,
  Header,
  Tr,
  Td,
}
