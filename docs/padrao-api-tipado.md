# Padrão de Integração Tipada: Formulário → API Next.js → API Externa (axios)

## Objetivo
Garantir que todas as comunicações entre frontend e backend sejam:
- 100% tipadas (sucesso e erro)
- Seguras (API externa nunca exposta ao usuário)
- Reutilizáveis para qualquer endpoint futuro
- Simples de manter e expandir

---

## 1. Tipos Compartilhados

Defina tipos universais para resposta de sucesso e erro de formulário:

```ts
// src/types/api.ts
export interface ApiMessage {
  codigo: number;
  descricao: string;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

// Erro de formulário (com fields)
export interface ApiFormErrorResponse {
  message: ApiMessage;
  data: {
    fields: ApiFieldError[];
  };
}

// Sucesso ou erro genérico (sem fields)
export interface ApiResponse<T = unknown> {
  message: ApiMessage;
  data?: T;
}
```

---

## 2. Rota Next.js (Proxy)

- Recebe o body do frontend
- Chama a API externa via axios
- Retorna resposta tipada (sucesso ou erro)

```ts
// src/app/api/[feature]/[endpoint]/route.ts
import { NextResponse } from "next/server";
import { api } from "@/lib/axios-client";
import { ApiResponse, ApiFormErrorResponse } from "@/types/api";
import { AxiosError } from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await api.post<ApiResponse<SeuTipoDeData>>(
      "/v1/endpoint",
      body
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const axiosError = error as AxiosError<ApiFormErrorResponse | ApiResponse>;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data || {
      message: { codigo: 500, descricao: "Erro inesperado." },
      data: { fields: [] }
    };
    return NextResponse.json(data, { status });
  }
}
```

---

## 3. Serviço Frontend

- Função que chama a rota interna Next.js
- Retorna resposta tipada

```ts
// src/services/[feature]-service.ts
import { ApiResponse, ApiFormErrorResponse } from "@/types/api";
export type MinhaResponse = ApiResponse<SeuTipoDeData> | ApiFormErrorResponse;

export async function minhaAcao(body: any): Promise<MinhaResponse> {
  const response = await fetch("/api/[feature]/[endpoint]", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}
```

---

## 4. Formulário React

- Usa o serviço tipado
- Distingue erro de formulário (exibe nos campos) e erro genérico (exibe toast)

```ts
import { ApiFormErrorResponse } from "@/types/api";

function isApiFormErrorResponse(response: any): response is ApiFormErrorResponse {
  return (
    !!response &&
    typeof response === "object" &&
    "data" in response &&
    Array.isArray((response as any).data?.fields) &&
    (response as any).data.fields.length > 0
  );
}

const onSubmit = async (data) => {
  const response = await minhaAcao(data);
  if (isApiFormErrorResponse(response)) {
    response.data.fields.forEach(fieldError => {
      form.setError(fieldError.field, { type: "server", message: fieldError.message });
    });
    toast.error(response.message.descricao);
    return;
  }
  if (response && response.message && (!('data' in response) || !(response as any).data?.fields)) {
    if (response.message.codigo < 0) {
      toast.error(response.message.descricao || "Erro desconhecido");
      return;
    }
  }
  toast.success("Ação realizada com sucesso!");
};
```

---

## 5. Replicando para Novos Endpoints

- Crie os tipos de data específicos do endpoint
- Siga o mesmo padrão para rota, serviço e formulário
- O tratamento de erro e sucesso será sempre igual

---

## Vantagens
- **Segurança:** API externa nunca exposta ao usuário
- **Tipagem:** Fluxo 100% tipado, fácil de manter
- **Reutilizável:** Basta replicar o padrão para qualquer endpoint
- **Clareza:** Separação clara entre erro de formulário e erro genérico

---

## Observações
- Sempre use os tipos `ApiResponse` e `ApiFormErrorResponse` para padronizar respostas
- O type guard `isApiFormErrorResponse` pode ser extraído para um utilitário global
- O padrão pode ser usado para GET, POST, PUT, DELETE, etc.
