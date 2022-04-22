import { createContext, ReactNode, useEffect, useState } from "react";
import Router, { useRouter } from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { authService } from '../services/ApiService/AuthService';
import { IAuthContextData, ISignInCredentials, IUser } from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as IAuthContextData);

let authChannel: BroadcastChannel;

export const signOut = () => {
  authChannel.postMessage("signOut");
  logout();
}

const logout = async () => {
  try {
    await authService.signOut();
  } catch (error) {
    console.log(error.response.data)
  }

  destroyCookie(null, 'meudinherim.token', {
    maxAge: 60 * 60 * 2, // 2 hours
    path: '/'
  });
  Router.push('/');
  Router.reload()
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter()
  const [user, setUser] = useState<IUser>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          logout();
          break;
        default:
          break;
      }
    }
    return authChannel.close
  }, []);

  useEffect(() => {
    const { 'meudinherim.token': token } = parseCookies();

    if (token) {
      authService.me().then(response => {
        const { id, name, email, avatar, enable_notification } = response.data;
        setUser({ id, name, email, avatar, enable_notification })
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          destroyCookie(null, 'meudinherim.token', {
            maxAge: 60 * 60 * 2, // 2 hours
            path: '/'
          });
        }

        signOut()
      })
    }
  }, []);

  const signIn = async ({ email, password, reCaptchaToken }: ISignInCredentials) => {
    const response = await authService.signIn({
      email,
      password,
      reCaptchaToken,
      device: 'web'
    })

    const { token, user } = response.data;

    setCookie(null, 'meudinherim.token', token, {
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/'
    });

    setUser(user)
    router.push('/dashboard');
  }

  return (
    <AuthContext.Provider value={{ 
      signIn, 
      signOut,
      setUser,
      user,
      isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}