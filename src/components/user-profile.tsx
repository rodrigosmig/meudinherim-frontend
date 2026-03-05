"use client";

import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth-context";
import { logout } from "@/services/auth-service";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function UserProfile() {
  const { usuario, isLoading } = useAuth();

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

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-800">
        <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-800">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Abrir menu do usuário"
          className="rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <Avatar name={usuario?.nome ?? ""} size={40} bg="#8b5cf6" color="#fff" ring />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-800 bg-gray-900 shadow-lg z-50 p-3">
            <div className="flex items-center gap-3 px-2 pb-2 border-b border-gray-800">
              <Avatar name={usuario?.nome ?? ""} size={64} bg="#8b5cf6" color="#fff" ring />
              <div className="text-left">
                <p className="text-sm font-medium text-white">{usuario?.nome}</p>
                <p className="text-xs text-gray-400">{usuario?.email}</p>
              </div>
            </div>

            <div className="mt-2">
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
          </div>
        )}
      </div>
    </div>
  );
}