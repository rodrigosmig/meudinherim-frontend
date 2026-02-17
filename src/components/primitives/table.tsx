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
        <tbody className="divide-y divide-gray-800">
          {children}
        </tbody>
      </table>
    </div>
  )
}

interface HeaderProps extends ComponentProps<'header'> {
  theadData: string[];
}

function Header({ theadData, ...props }: HeaderProps) {
  return (
    <thead className="bg-gray-800/50 border-b border-gray-800">
      <tr className="border-b border-gray-800">
        {theadData.map(head => (
          <th key={head} className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {head}
          </th>
        ))}
      </tr>
    </thead>

  )
}

interface TrProps extends ComponentProps<'tr'> { }

function Tr({ ...props }: TrProps) {
  return (
    <tr className="transition-all duration-200 ease-in-out hover:bg-violet-600/5" {...props} />
  )
}

interface TdProps extends ComponentProps<'td'> { }

function Td({ ...props }: TdProps) {
  return (
    <td className="px-6 py-4" {...props} />
  )
}

export const Table = {
  Root: TableRoot,
  Header,
  Tr,
  Td,
}