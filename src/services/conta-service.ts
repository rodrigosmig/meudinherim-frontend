export type Conta = {
  uuid: string;
  nome: string;
  tipo: string;
  ativo: boolean;
  saldo: number;
};

export interface ContasRequest {
  comPaginacao: boolean;
  ativas: boolean;
  pagina: number;
  size: number;
}

export interface ListaDeContas {
  contas: Conta[];
}

export const contaService = {
  listar: async (request: ContasRequest) => {
    // Criar objeto URLSearchParams com os parâmetros
    const params = new URLSearchParams({
      ativas: request.ativas.toString(),
      comPaginacao: request.comPaginacao.toString(),
      pagina: request.pagina.toString(),
      size: request.size.toString(),
    });

    // Construir a URL completa com os parâmetros
    const url = `/api/proxy/v1/contas?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    });
    console.log("URL de requisição:", url);
    if (!res.ok) throw new Error("Falha ao listar contas");

    console.log("Resposta da API:", await res.clone().json()); // Clonar a resposta para ler o corpo sem consumir a original
    return res.json();
  },
};

// export const contaService = {
//   list: (
//     request: ContasRequest,
//   ): Promise<AxiosResponse<ApiResponse<ListaDeContas>>> =>
//     httpClient.get(
//       `/v1/contas?ativas=${request.ativas}&comPaginacao=${request.comPaginacao}&pagina=${request.pagina}&size=${request.size}`,
//     ),
// create: (values: IAccountFormData): Promise<AxiosResponse<IAccount>> =>
//   apiClient.post(`/accounts`, values),
// update: (values: IAccountUpdateData): Promise<AxiosResponse<IAccount>> =>
//   apiClient.put(`/accounts/${values.accountId}`, values.data),
// delete: (id: number): Promise<AxiosResponse> =>
//   apiClient.delete(`/accounts/${id}`),
// balance: (
//   id: AccountIdType,
// ): Promise<AxiosResponse<IAccountBalanceResponse>> =>
//   apiClient.get(`/accounts/balance/${id}`),
//};

// export async function listAccounts() {
//   const response = await apiClient.get<Account[]>("accounts");

//   return {
//     ...response,
//     data: response.data ?? [],
//   };
// }

// export async function updateAccount(
//   accountId: string,
//   payload: Partial<Pick<Account, "name" | "balance">>,
// ) {
//   return apiClient.put<Account>(`accounts/${accountId}`, payload);
// }
