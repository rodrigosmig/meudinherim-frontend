import React from 'react';

interface TableProps {
  theadData: string[];
  children: React.ReactNode;
}

export function Table({ theadData, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            {theadData.map(head => (
              <th key={head} className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {children}

        </tbody>
      </table>
    </div>
  )
}