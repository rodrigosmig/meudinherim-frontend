import React from 'react';

interface UserProfileProps {
  nome: string;
  email: string;
}

export default function UserProfile({ nome, email }: UserProfileProps) {
  return (
    <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-800">
      <div className="text-right">
        <p className="hidden md:block text-sm font-medium text-white">{nome}</p>
        <p className="hidden md:block text-xs text-gray-400">{email}</p>
      </div>
      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=8b5cf6&color=fff`} alt="User" className="w-10 h-10 rounded-full ring-2 ring-violet-500" />
    </div>
  )
}