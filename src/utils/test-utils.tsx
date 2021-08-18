import { FC, ReactElement } from "react";
import {render, RenderOptions} from '@testing-library/react'
import { AuthContext } from "../contexts/AuthContext";

const signIn = jest.fn();
const signOut = jest.fn();
const setUser = jest.fn();
const isAuthenticated = true;
const user = {
  id: 1,
  name: 'test',
  email: 'test@test.com',
  avatar: 'test',
  enable_notification: false
}

const AllTheProviders:FC = ({ children }) => {
  return (
      <AuthContext.Provider value={{ signIn, signOut, setUser, user, isAuthenticated }}>
        {children}
      </AuthContext.Provider>
  );
};

const customRender = (
  ui: ReactElement, 
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  render(ui, { wrapper: AllTheProviders, ...options });
};

export * from "@testing-library/react";
export { customRender as render };