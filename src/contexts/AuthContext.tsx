import { createContext, ReactNode, useEffect, useState } from "react";
import Router, { useRouter } from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { authService } from '../services/ApiService/AuthService';

interface User {
  id: number;
  name: string
  email: string;
  avatar: string;
  enable_notification: boolean;
}

type SignInCredentials = {
  email: string;
  password: string
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  setUser: (user: User) => void,
  user: User;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

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
  const [user, setUser] = useState<User>();
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
      .catch(() => {
        signOut()
      })
    }
  }, []);

  const signIn = async ({ email, password }: SignInCredentials) => {
    const response = await authService.signIn({
      email,
      password,
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