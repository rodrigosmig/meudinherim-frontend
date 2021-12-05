import { useQuery } from "react-query";
import { cardService } from "../services/ApiService/CardService";


export const getCards = async () => {
  const response = await cardService.list();

  const data = response.data.data

  return data
}

export const getCardsForForm = async () => {
  const response = await cardService.list();

  const data = response.data.data.map(card => {
    return {
      value: String(card.id),
      label: card.name
    }
  })

  return data;
}

export const useCards = () => {
  return useQuery(['cards'], () => getCards(), {
    staleTime: 1000 * 5
  })
}

export const useCardsForm = () => {
  return useQuery(['cards-form'], () => getCardsForForm(), {
    staleTime: 1000 * 5
  })
}