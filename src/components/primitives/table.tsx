import { cn } from '@/helpers/string-helper';
import React, { ComponentProps } from 'react';

interface TableProps {
  theadData: string[];
  children: React.ReactNode;
}

export function TableRoot({ theadData, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <Header theadData={theadData} />
        <tbody className="divide-y divide-default-border">
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
    <thead className={cn("bg-gray-700/30", className)} {...props}>
      <tr className="border-b border-default-border">
        {theadData.map(head => (
          <th key={head} className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
    <tr className={cn("px-3 transition-all duration-200 ease-in-out hover:bg-primary/5", className)} {...props} />
  )
}

interface TdProps extends ComponentProps<'td'> {
  className?: string;
}

function Td({ className, ...props }: TdProps) {
  return (
    <td className={cn("px-6 py-4", className)} {...props} />
  )
}

export const Table = {
  Root: TableRoot,
  Header,
  Tr,
  Td,
}