export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiFormErrorResponse {
  message: {
    codigo: number;
    descricao: string;
  };
  data: {
    fields: ApiFieldError[];
  };
}
