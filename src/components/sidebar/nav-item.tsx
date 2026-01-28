import React, { ElementType } from 'react';

interface NavItemProps {
  title: string;
  icon: ElementType;
}

export function NavItem({ title, icon: Icon }: NavItemProps) {
  return (
    <a href="#" className="sidebar-item active flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-violet-600/10 hover:border-l-3 border-violet-500 transition-all duration-200 ease-in-out">
      <Icon className="w-5 h-5" />
      <span className="font-medium">{title}</span>
    </a>
  )
}