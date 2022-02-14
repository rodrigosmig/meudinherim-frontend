import { 
  IAccountScheduling, 
  IAccountSchedulingCreateData, 
  IAccountSchedulingFormData, 
  IAccountSchedulingResponseError, 
  IAccountSchedulingUpdateData, 
  IGenerateResponseError, 
  IResponse, 
  ITransactionData,
  ITransactionFormData,
  ITransactionResponseError
} from "./accountScheduling";

export interface IReceivable extends Omit<IAccountScheduling, "category"> {
  category: {
    id: number;
    name: string;
    type: 1;
  }
};

export interface IReceivableFormData extends IAccountSchedulingFormData {}

export interface IReceivableCreateData extends IAccountSchedulingCreateData {};

export interface IReceivableUpdateData extends IAccountSchedulingUpdateData {};

export interface IReceivementFormData extends ITransactionFormData {};

export interface IReceivementData extends ITransactionData {};

export interface IReceivableResponse extends Omit<IResponse, "data"> {
  data: IReceivable[]
};

export interface IGenerateReceivementResponseError extends IGenerateResponseError {};

export interface IReceivableResponseError extends IAccountSchedulingResponseError {};

export interface IReceivementResponseError extends ITransactionResponseError {};