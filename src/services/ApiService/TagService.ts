import { AxiosResponse } from 'axios';
import { ITagResponse } from './../../types/tag';
import { setupApiClient } from './../api';

const apiClient = setupApiClient(undefined);

export const tagService = {
  list: (): Promise<AxiosResponse<ITagResponse>> => apiClient.get(`/tags`)
};