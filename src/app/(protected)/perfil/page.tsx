"use client";

import { Avatar } from "@/components/avatar";
import { Button } from "@/components/primitives/button";
import ResponsivePageTitle from "@/components/header/responsive-page-title";
import { Card } from "@/components/primitives/card";
import { Input } from "@/components/primitives/input";
import Switch from "@/components/primitives/switch";
import { toast } from "@/components/toast";
import { useAuth } from "@/contexts/auth-context";
import { catalogoErros } from "@/helpers/erros-helper";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { PerfilFormValue, SenhaFormValue, perfilSchema, senhaSchema } from "@/schema-validation/perfil";
import { usuarioService } from "@/services/usuario-service";
import { ApiFormError } from "@/types/api";
import ApiError from "@/types/application-error";
import { AlterarImagemData, AlterarPerfilData } from "@/types/usuario";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Eye, EyeOff, Info, KeyRound, Lock, Mail, User, Unlock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { capitalize } from "@/helpers/string-helper";

type Tab = "perfil" | "senha";

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<Tab>("perfil");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ResponsivePageTitle title="Meu Perfil" />

      <Card.Root>
        <div className="flex border-b border-default-border">
          <TabButton active={activeTab === "perfil"} onClick={() => setActiveTab("perfil")}>
            <User className="w-4 h-4" />
            Perfil
          </TabButton>
          <TabButton active={activeTab === "senha"} onClick={() => setActiveTab("senha")}>
            <KeyRound className="w-4 h-4" />
            Senha
          </TabButton>
        </div>

        {activeTab === "perfil" && <PerfilForm />}
        {activeTab === "senha" && <SenhaForm />}
      </Card.Root>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative cursor-pointer ${
        active
          ? "text-primary border-b-2 border-primary -mb-px"
          : "text-gray-400 hover:text-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

function PerfilForm() {
  const { usuario, updateUsuario, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(usuario?.avatar || undefined);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [emailUnlocked, setEmailUnlocked] = useState(false);

  const form = useForm<PerfilFormValue>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: usuario?.nome ?? "",
      email: usuario?.email ?? "",
      ativaNotificacao: usuario?.ativaNotificacao ?? false,
    },
  });

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const result = await usuarioService.alterarImagem({ file });
      if ("data" in result && result.data) {
        const { urlAvatar } = result.data as AlterarImagemData;
        setAvatarSrc(urlAvatar);
        updateUsuario({ avatar: urlAvatar });
        toast.success("Foto atualizada com sucesso!");
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.apiMessage.descricao : DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUnlockEmail = () => {
    setEmailUnlocked(true);
  };

  const onSubmit = async (data: PerfilFormValue) => {
    const emailChanged = emailUnlocked && data.email !== usuario?.email;

    try {
      const result = await usuarioService.alterarPerfil(data);
      let updatedUsuario;
      if ("data" in result && result.data) {
        const { usuario: responseUsuario } = result.data as AlterarPerfilData;
        if (responseUsuario) {
          updatedUsuario = responseUsuario;
          updateUsuario(responseUsuario);
        }
      }

      if (emailChanged) {
        toast.warning("E-mail alterado! Verifique sua caixa de entrada para confirmar o novo endereço. Você será desconectado agora.", 8000);
        setTimeout(async () => {
          await logout();
          router.push("/login");
        }, 3000);
        return;
      }

      form.reset(
        updatedUsuario
          ? { nome: updatedUsuario.nome, email: updatedUsuario.email, ativaNotificacao: updatedUsuario.ativaNotificacao }
          : data
      );
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;
          formError?.fields?.forEach((fieldError) => {
            if (fieldError.field === "nome") form.setError("nome", { type: "server", message: fieldError.message });
            if (fieldError.field === "email") form.setError("email", { type: "server", message: fieldError.message });
          });
        }

        if (error.apiMessage?.codigo === catalogoErros.EMAIL_JA_CADASTRADO) {
          form.setError("email", {
            type: "server",
            message: capitalize(error.apiMessage.descricao),
          });
          form.setFocus("email");
        }

        toast.error(error.apiMessage.descricao);
        return;
      }
      toast.error(DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Avatar section */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <div
            className="relative cursor-pointer rounded-full overflow-hidden"
            onClick={handleAvatarClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleAvatarClick()}
            aria-label="Alterar foto de perfil"
          >
            <Avatar
              name={usuario?.nome ?? ""}
              src={avatarSrc}
              size={96}
              className="transition-all duration-200 group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 rounded-full">
              {isUploadingAvatar ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAvatarClick}
          disabled={isUploadingAvatar}
          className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploadingAvatar ? "Enviando..." : "Alterar foto"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Profile form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nome"
          icon={User}
          placeholder="Seu nome"
          error={form.formState.errors.nome}
          {...form.register("nome")}
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-300">E-mail</label>
            {!emailUnlocked && (
              <button
                type="button"
                onClick={handleUnlockEmail}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors cursor-pointer"
              >
                <Unlock className="w-3 h-3" />
                Alterar e-mail
              </button>
            )}
          </div>
          <Input
            icon={emailUnlocked ? Mail : Lock}
            placeholder="seu@email.com"
            disabled={!emailUnlocked}
            error={form.formState.errors.email}
            {...form.register("email")}
          />
          {emailUnlocked && (
            <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">
                Ao alterar seu e-mail, um link de confirmação será enviado para o novo endereço. O e-mail só será atualizado após a confirmação.
              </p>
            </div>
          )}
        </div>

        <div className="pt-1">
          <Switch
            label="Receber notificações"
            checked={form.watch("ativaNotificacao")}
            onCheckedChange={(checked) => form.setValue("ativaNotificacao", checked, { shouldDirty: true })}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            isLoading={form.formState.isSubmitting}
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            Salvar alterações
          </Button>
        </div>
      </form>
    </div>
  );
}

function SenhaForm() {
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmacao, setShowConfirmacao] = useState(false);

  const form = useForm<SenhaFormValue>({
    resolver: zodResolver(senhaSchema),
    defaultValues: {
      senhaAtual: "",
      novaSenha: "",
      novaSenhaConfirmacao: "",
    },
  });

  const onSubmit = async (data: SenhaFormValue) => {
    try {
      await usuarioService.alterarSenha(data);
      toast.success("Senha alterada com sucesso!");
      form.reset();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.apiMessage.codigo === catalogoErros.CAMPO_INVALIDO_OU_OBRIGATORIO) {
          const formError = error.data as ApiFormError;
          formError?.fields?.forEach((fieldError) => {
            if (fieldError.field === "senhaAtual") form.setError("senhaAtual", { type: "server", message: fieldError.message });
            if (fieldError.field === "novaSenha") form.setError("novaSenha", { type: "server", message: fieldError.message });
            if (fieldError.field === "novaSenhaConfirmacao") form.setError("novaSenhaConfirmacao", { type: "server", message: fieldError.message });
          });
        }

        if (error.apiMessage?.codigo === catalogoErros.SENHA_ATUAL_INVALIDA) {
          form.setError("senhaAtual", {
            type: "server",
            message: capitalize(error.apiMessage.descricao),
          });
          form.setFocus("senhaAtual");
        }

        toast.error(error.apiMessage.descricao);
        return;
      }
      toast.error(DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PasswordInput
          label="Senha atual"
          placeholder="Digite sua senha atual"
          show={showSenhaAtual}
          onToggle={() => setShowSenhaAtual((v) => !v)}
          error={form.formState.errors.senhaAtual}
          {...form.register("senhaAtual")}
        />

        <PasswordInput
          label="Nova senha"
          placeholder="Mínimo 8 caracteres"
          show={showNovaSenha}
          onToggle={() => setShowNovaSenha((v) => !v)}
          error={form.formState.errors.novaSenha}
          {...form.register("novaSenha")}
        />

        <PasswordInput
          label="Confirmar nova senha"
          placeholder="Repita a nova senha"
          show={showConfirmacao}
          onToggle={() => setShowConfirmacao((v) => !v)}
          error={form.formState.errors.novaSenhaConfirmacao}
          {...form.register("novaSenhaConfirmacao")}
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            isLoading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Alterar senha
          </Button>
        </div>
      </form>
    </div>
  );
}

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  show: boolean;
  onToggle: () => void;
  error?: import("react-hook-form").FieldError;
}

const PasswordInput = ({
  label,
  show,
  onToggle,
  error,
  ...props
}: PasswordInputProps) => {
  const id = `pw-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const hasError = !!error;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="mb-1 text-sm text-gray-300">
        {label}
      </label>
      <div
        className={`flex w-full border text-xs md:text-base text-input-text items-center gap-2 rounded-lg px-3 py-2 shadow-2xs bg-gray-800 hover:bg-gray-900 focus-within:ring-3 ${
          hasError
            ? "border-red-400 focus-within:ring-red-400"
            : "border-default-border focus-within:ring-primary"
        }`}
      >
        <KeyRound className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-gray-500" />
        <input
          id={id}
          type={show ? "text" : "password"}
          className="flex-1 w-full border-0 bg-transparent p-0 outline-none placeholder-default-placeholder"
          {...props}
        />
        <button
          type="button"
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          tabIndex={-1}
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {hasError && (
        <span className="pt-1 text-sm text-error">{error.message?.toString()}</span>
      )}
    </div>
  );
};
