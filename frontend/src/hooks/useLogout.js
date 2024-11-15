'use client'

import { useAuth } from './useAuthContext'
import { useToast } from "@/hooks/use-toast"

export const useLogout = () => {
  const { dispatch } = useAuth()
  const { toast } = useToast()

  const logout = () => {
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  return { logout }
}