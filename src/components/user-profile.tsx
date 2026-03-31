"use client";


import { useAuth } from "@/contexts/auth-context";
import { logout } from "@/services/auth-service";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "./avatar";
import { DropdownMenu } from "./primitives/dropdown-menu";

export default function UserProfile() {
  const { usuario, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  const handleGoToProfile = () => {
    router.push("/perfil");
  };

  const handleGoToSettings = () => {
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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button
            type="button"
            aria-label="Abrir menu do usuário"
            className="rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Avatar name={usuario?.nome ?? ""} size={40} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align="end" className="w-full">
          <div className="p-1">
            <div className="flex items-center gap-3 px-2 pb-2 border-b border-line-separator">
              <Avatar name={usuario?.nome ?? ""} size={52} />
              <div className="text-left">
                <p className="text-sm font-medium text-white">{usuario?.nome}</p>
                <p className="text-xs text-gray-400">{usuario?.email}</p>
              </div>
            </div>

            <div className="mt-2">
              <DropdownMenu.Item>
                <button
                  type="button"
                  onClick={handleGoToProfile}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  Perfil
                </button>
              </DropdownMenu.Item>

              <DropdownMenu.Item>
                <button
                  type="button"
                  onClick={handleGoToSettings}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
              </DropdownMenu.Item>

              <div className="my-1 h-px bg-line-separator" />

              <DropdownMenu.Item>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </DropdownMenu.Item>
            </div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}