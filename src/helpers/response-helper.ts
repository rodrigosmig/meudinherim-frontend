import ApiError from "@/types/application-error";

export async function handleApiResponse<T = unknown>(
  response: Response,
): Promise<T> {
  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload);
  }

  return payload as T;
}
