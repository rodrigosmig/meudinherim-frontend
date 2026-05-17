'use client'

import { authService } from '@/services/auth-service'
import { LoginRequest } from '@/types/auth'
import { Usuario } from '@/types/usuario'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextData {
  usuario: Usuario | null
  isLoading: boolean
  login: (payload: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  updateUsuario: (updates: Partial<Usuario>) => void
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (request: LoginRequest) => {
    setIsLoading(true)
    await authService.autenticar(request);

    await fetchUserData();

    setIsLoading(false)
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUsuario(null)
  }

  const updateUsuario = (updates: Partial<Usuario>) => {
    setUsuario((prev) => prev ? { ...prev, ...updates } : prev)
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
    <AuthContext.Provider value={{ usuario, isLoading, login, logout, updateUsuario }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)