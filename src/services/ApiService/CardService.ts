import { AxiosResponse } from "axios";
import { setupApiClient } from "../api";

interface Card {
  id: number;
  name: string;
  pay_day: number;
  closing_day: number;
  credit_limit: number;
  balance: number;
}

interface CardResponse {
  data: Card[]
}

interface FormData {
  name: string;
  pay_day: number;
  closing_day: number;
  credit_limit: number;
}

interface EditCardFormData {
  cardId: number;
  data: FormData;
}

const apiClient = setupApiClient();

export const cardService = {
  list: (): Promise<AxiosResponse<CardResponse>> => apiClient.get(`/cards`),
  create: (values: FormData): Promise<AxiosResponse<Card>> => apiClient.post(`/cards`, values),
  update: (values: EditCardFormData): Promise<AxiosResponse<Card>> => apiClient.put(`/cards/${values.cardId}`, values.data),
  delete: (id: number): Promise<AxiosResponse> => apiClient.delete(`/cards/${id}`),
};