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
