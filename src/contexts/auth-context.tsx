'use client'

import { autenticar } from '@/services/auth-service'
import { LoginBody } from '@/types/auth'
import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  // outros campos
}

interface AuthContextData {
  user: User | null
  token: string | null // Adicionamos o token aqui
  isLoading: boolean
  //login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null) // Estado para o token
  const [isLoading, setIsLoading] = useState(true)

  // Função de login
  const login = async (loginBody: LoginBody) => {
    const response = await autenticar(loginBody)

    //const data = await response.json()

    //setUser(data.user)
  }

  // Função para buscar dados do usuário (agora usando o cookie)
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setToken(data.token) // Token vem do cookie via API route
      } else {
        setUser(null)
        setToken(null)
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      setUser(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Função de logout
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setToken(null)
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)