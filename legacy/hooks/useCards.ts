import { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../contexts/AuthContext";
import { cardService } from "../services/ApiService/CardService";
import { CARDS, CARDS_FORM } from "../utils/helpers";

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
  const { user } = useContext(AuthContext);

  return useQuery([CARDS, user?.id], () => getCards(), {
    staleTime: 1000 * 60 * 15
  })
}

export const useCardsForm = () => {
  const { user } = useContext(AuthContext);

  return useQuery([CARDS_FORM, user?.id], () => getCardsForForm(), {
    staleTime: 1000 * 60 * 15
  })
}