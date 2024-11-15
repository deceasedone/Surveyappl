'use client'

import { useState } from 'react'
import { useAuth } from './useAuthContext'
import { useToast } from "./use-toast"

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuth()
  const { toast } = useToast()

  const signup = async (email, password, role, name, username) => {
    setIsLoading(true)
    setError(null)

    const apiUrl = `${import.meta.env.VITE_API_URL}/api/users/signup`;
    console.log('Signup API URL:', apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, name, username }),
        credentials: 'include',
      })

      const data = await response.json()
      console.log('Signup response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      // Add expiration time (e.g., 7 days from now)
      const expiresAt = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      const userData = { ...data.user, token: data.token, expiresAt: expiresAt.toISOString() }

      localStorage.setItem('user', JSON.stringify(userData))
      dispatch({ type: 'LOGIN', payload: userData })
      
      return { success: true, message: `Welcome, ${name}!` }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An unexpected error occurred')
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}