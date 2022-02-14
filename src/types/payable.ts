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

export interface IPayable extends Omit<IAccountScheduling, "category"> {
  category: {
    id: number;
    name: string;
    type: 2;
  }
};

export interface IPayableFormData extends IAccountSchedulingFormData {}

export interface IPayableCreateData extends IAccountSchedulingCreateData {};

export interface IPayableUpdateData extends IAccountSchedulingUpdateData {};

export interface IPaymentFormData extends ITransactionFormData {};

export interface IPaymentData extends ITransactionData {};

export interface IPayableResponse extends Omit<IResponse, "data"> {
  data: IPayable[]
};

export interface IGeneratePaymentResponseError extends IGenerateResponseError {};

export interface IPayableResponseError extends IAccountSchedulingResponseError {};

export interface IPaymentResponseError extends ITransactionResponseError {};