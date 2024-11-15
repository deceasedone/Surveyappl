'use client';

import React, { createContext, useReducer, useEffect, useCallback, useContext } from 'react';
import { useToast } from "@/hooks/use-toast"

const AuthContext = createContext(undefined);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
  });
  const { toast } = useToast()

  const initializeAuth = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser.expiresAt && new Date(parsedUser.expiresAt) > new Date()) {
          dispatch({ type: 'LOGIN', payload: parsedUser });
        } else {
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
          toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          })
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
      toast({
        title: "Authentication Error",
        description: "There was a problem with your authentication. Please try logging in again.",
        variant: "destructive",
      })
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [toast]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AuthContext state:', state);
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {!state.isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
