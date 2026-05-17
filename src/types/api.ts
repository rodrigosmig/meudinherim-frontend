export interface ApiMessage {
  codigo: number;
  descricao: string;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiFormError {
  fields: ApiFieldError[];
}

// Erro de formulário (com fields)
export interface ApiFormErrorResponse {
  message: ApiMessage;
  data: ApiFormError;
}

// Sucesso ou erro genérico (sem fields)
export interface ApiResponse<T = unknown> {
  message: ApiMessage;
  data?: T;
}
