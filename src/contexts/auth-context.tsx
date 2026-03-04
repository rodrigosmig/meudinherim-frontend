'use client'

import { autenticar } from '@/services/auth-service'
import { LoginBody } from '@/types/auth'
import { Usuario } from '@/types/usuario'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextData {
  usuario: Usuario | null
  isLoading: boolean
  login: (payload: LoginBody) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (loginBody: LoginBody) => {
    setIsLoading(true)
    await autenticar(loginBody);

    await fetchUserData();

    setIsLoading(false)
  }

  // Função de logout
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUsuario(null)
  }

  async function fetchUserData() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/session')
      if (!res.ok) {
        setUsuario(null)
        return
      }
      const payload = await res.json()
      setUsuario(payload.user ?? null)
    } catch (err) {
      setUsuario(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)