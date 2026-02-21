import { apiClient } from "@/lib/api-client";

export type CategoryType = "entrada" | "saida";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  showOnDashboard?: boolean;
};

export async function listCategories() {
  const response = await apiClient.get<Category[]>("categories");

  return {
    ...response,
    data: response.data ?? [],
  };
}

export async function updateCategory(
  categoryId: string,
  payload: Partial<Pick<Category, "name" | "type" | "showOnDashboard">>,
) {
  return apiClient.put<Category>(
    `categories/${categoryId}`,
    payload,
  );
}
