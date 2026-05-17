"use client";

import { Button } from "@/components/primitives/button";
import { toast } from "@/components/toast";
import { DEFAULT_ERROR_MESSAGE } from "@/helpers/route-helpers";
import { validarCodigoSchema, ValidarCodigoFormValue } from "@/schema-validation/auth";
import { authService } from "@/services/auth-service";
import { ApiResponse } from "@/types/api";
import ApiError from "@/types/application-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipboardEvent, useRef } from "react";
import { useForm } from "react-hook-form";

export function ValidarCodigoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<ValidarCodigoFormValue>({
    resolver: zodResolver(validarCodigoSchema),
    defaultValues: { codigo: "" },
  });

  const codigo = form.watch("codigo").padEnd(6, "");

  const onSubmit = async (data: ValidarCodigoFormValue) => {
    try {
      const response = await authService.validarCodigoRecuperacao({ email, codigo: data.codigo });
      const token = (response as ApiResponse<string>).data || "";

      toast.success("Código validado com sucesso! Defina uma nova senha.");

      router.push(`/resetar-senha?token=${encodeURIComponent(token)}`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.apiMessage.descricao);
        return;
      }
      toast.error(DEFAULT_ERROR_MESSAGE);
    }
  };

  function setDigit(index: number, char: string) {
    const digits = codigo.split("");
    digits[index] = char;
    form.setValue("codigo", digits.join("").replace(/\D/g, "").slice(0, 6));
  }

  function handleInput(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!codigo[index] && index > 0) {
        setDigit(index - 1, "");
        inputRefs.current[index - 1]?.focus();
      } else {
        setDigit(index, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    form.setValue("codigo", pasted.padEnd(6, "").slice(0, 6));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  const codigoCompleto = form.watch("codigo").length === 6;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {email && (
        <p className="text-sm text-gray-400 text-center">
          Código enviado para{" "}
          <span className="text-gray-200 font-medium">{email}</span>
        </p>
      )}

      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={codigo[i] ?? ""}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 h-14 text-center text-xl font-bold bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all caret-transparent"
            autoFocus={i === 0}
          />
        ))}
      </div>

      {form.formState.errors.codigo && (
        <p className="text-error text-sm text-center">{form.formState.errors.codigo.message}</p>
      )}

      <Button
        type="submit"
        className="w-full"
        isLoading={form.formState.isSubmitting}
        disabled={!codigoCompleto || form.formState.isSubmitting}
      >
        Verificar código
      </Button>
    </form>
  );
}
