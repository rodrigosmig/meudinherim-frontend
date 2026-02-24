"use client";

import { logout } from "@/services/auth-service";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UserProfileProps {
  nome: string;
  email: string;
}

export default function UserProfile({ nome, email }: UserProfileProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push("/login");
    router.refresh();
  };

  const handleGoToProfile = () => {
    setIsOpen(false);
    router.push("/perfil");
  };

  const handleGoToSettings = () => {
    setIsOpen(false);
    router.push("/configuracoes");
  };

  return (
    <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-800">
      <div className="text-right">
        <p className="hidden md:block text-sm font-medium text-white">{nome}</p>
        <p className="hidden md:block text-xs text-gray-400">{email}</p>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Abrir menu do usuário"
          className="rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=8b5cf6&color=fff`}
            alt={nome}
            className="w-10 h-10 rounded-full ring-2 ring-violet-500"
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-800 bg-gray-900 shadow-lg z-50 p-1">
            <button
              type="button"
              onClick={handleGoToProfile}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg cursor-pointer"
            >
              <User className="w-4 h-4" />
              Perfil
            </button>

            <button
              type="button"
              onClick={handleGoToSettings}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </button>

            <div className="my-1 h-px bg-gray-800" />

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  )
}