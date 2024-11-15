'use client'

import { useState } from 'react'
import { useAuth } from './useAuthContext'
import { useToast } from "@/hooks/use-toast"

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuth()
  const { toast } = useToast()

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const apiUrl = `${import.meta.env.VITE_API_URL}/api/users/login`;
    console.log('Login API URL:', apiUrl);

    try {
      console.log('Sending login request with email:', email);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Add expiration time (e.g., 7 days from now)
      const expiresAt = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      const userData = { ...data.user, token: data.token, expiresAt: expiresAt.toISOString() }

      localStorage.setItem('user', JSON.stringify(userData))
      dispatch({ type: 'LOGIN', payload: userData })
      
      return { success: true, message: `Welcome back, ${userData.name || email}!` }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred')
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}