import { OptionBase } from 'chakra-react-select';

export interface ITag {
  id: number;
  name: string;
}

export interface ITagResponse {
  data: ITag[]
}

export interface TagOptions {
  label: string;
  value: string;
}