import { Bell, Landmark, Plus, User, WalletCards } from 'lucide-react';
import React from 'react';

import UserProfile from './user-profile';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>

          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Landmark className="w-5 h-5 text-gray-400" />
          </button>

          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <WalletCards className="w-5 h-5 text-gray-400" />
          </button>

          <UserProfile nome='Rodrigo Miguel' email='rodrigosmig@gmail.com' />
        </div>
      </div>
    </header>
  )
}