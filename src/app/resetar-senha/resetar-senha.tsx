"use client";

import { AuthLayout } from "@/components/auth-layout";
import { toast } from "@/components/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { ResetarSenhaForm } from "./resetar-senha-form";

export function ResetarSenha() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  useEffect(() => {
    if (!token) {
      toast.error("Token inválido. Não é possível resetar a senha");
      router.push("/login");
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <AuthLayout
      title="Nova senha"
      subtitle="Escolha uma senha forte para sua conta"
      backHref="/login"
    >
      <ResetarSenhaForm token={token} />
    </AuthLayout>
  );
}
