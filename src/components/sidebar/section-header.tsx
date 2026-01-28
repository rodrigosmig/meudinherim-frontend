import React from 'react';

interface SectionHeaderProps {
  children: React.ReactNode;
}

export function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
      {children}
    </div>
  )
}