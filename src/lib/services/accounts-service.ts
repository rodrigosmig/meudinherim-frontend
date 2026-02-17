import { apiClient } from "@/lib/api-client";

export type Account = {
  id: string;
  name: string;
  balance: number;
};

export async function listAccounts() {
  const response = await apiClient.get<Account[]>("accounts");

  return {
    ...response,
    data: response.data ?? [],
  };
}

export async function updateAccount(
  accountId: string,
  payload: Partial<Pick<Account, "name" | "balance">>,
) {
  return apiClient.put<Account>(`accounts/${accountId}`, payload);
}
