interface UserFormData {
  email: string;
  password: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  enable_notification: boolean;
}

export interface ISignInCredentials extends UserFormData {
  device?: string;
  reCaptchaToken: string;
}

export interface IAuthContextData {
  signIn: (credentials: ISignInCredentials) => Promise<void>;
  signOut: () => void;
  setUser: (user: IUser) => void,
  user: IUser;
  isAuthenticated: boolean;
}

export interface IRegisterData extends UserFormData {
  name: string
  password_confirmation: string;
  enable_notification: boolean;
  reCaptchaToken: string;
}

export interface IResetPasswordData extends Omit<IRegisterData, "name" | "enable_notification"> {}

export interface IProfileUpdateData {
  name: string
  email: string;
  enable_notification: boolean;
}

export interface IPasswordUpdateData {
  current_password: string
  password: string;
  password_confirmation: string;
}

export interface IForgotPasswordData {
  email: string
}

export interface IForgotPasswordResponse {
  message: string;
  errors?: {
    email: string[]
  }
}

export interface ISignInResponse {
  token: string;
  user: IUser
}

export interface IAvatarUpdateResponse {
  message: string;
  avatar: string
}

export interface IResetPasswordResponseError {
  token: string[];
  email: string[];
  password: string[];
}

export type IResetPaaswordErrorKey = keyof IResetPasswordResponseError;