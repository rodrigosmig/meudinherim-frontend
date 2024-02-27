import { AuthContext } from './../contexts/AuthContext';
import { useQuery } from 'react-query';
import { TAGS } from './../utils/helpers';
import { useContext } from 'react';
import { tagService } from './../services/ApiService/TagService';

export const getAccounts = async () => {
  const response = await tagService.list();

  const data = response.data.data

  return data
}

export const useTags = () => {
  const { user } = useContext(AuthContext);

  return useQuery([TAGS, user?.id], () => getAccounts(), {
    staleTime: 1000 * 60 * 15
  })
}