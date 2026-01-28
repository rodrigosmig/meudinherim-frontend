import { ReactNode } from 'react';

interface NavSectionProps {
  title: string;
  children?: ReactNode;
}

export function NavSection({ title, children }: NavSectionProps) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">{title}</p>
      {children}
    </div>
  )
}