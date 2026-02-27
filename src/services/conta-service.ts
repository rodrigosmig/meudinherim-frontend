import { apiClient } from "@/lib/axios-client";
import { ApiResponse } from "@/types/api";
import { AxiosResponse } from "axios";

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
  list: (
    request: ContasRequest,
  ): Promise<AxiosResponse<ApiResponse<ListaDeContas>>> =>
    apiClient.get(
      `/v1/contas?ativas=${request.ativas}&comPaginacao=${request.comPaginacao}&pagina=${request.pagina}&size=${request.size}`,
    ),
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
};

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
