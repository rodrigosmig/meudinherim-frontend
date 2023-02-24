export type Type = 'money' | 'savings' | 'checking_account' | 'investment';

export type AccountType = {
  id: Type
  desc: string;
}

export interface IAccount {
  id: number;
  type: AccountType;
  name: string;
  balance: number;
  active: boolean;
}

export interface IAccountFormData {
  type: string;
  name: string;
  active: boolean;
}

export type IAccountResponseError = {
  type: string[];
  name: string[];
}

export type IAccountErrorKey = keyof IAccountResponseError;


export interface IAccountResponse {
  data: IAccount[]
}

export interface IAccountBalanceResponse {
  balances: {
    account_id: number;
    account_name: string;
    balance: number;
  }[];
  total: number
}

export interface IAccountUpdateData {
  accountId: number;
  data: IAccountFormData;
}

export type AccountIdType = number | 'all';

export interface IBalanceData {
  balance: string;
  positive: boolean;
  account_id: number;
  account_name: string;
}

export interface ITotalData {
  value: string;
  positive: boolean 
}

export interface AccountsBalanceState {
  isLoading: boolean;
  balances: IBalanceData[];
  total: ITotalData
}