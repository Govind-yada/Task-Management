import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem('taskflow_user')) || null,
  token: localStorage.getItem('taskflow_token') || null,
  loading: false,
  initialized: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('taskflow_token', action.payload.token);
      localStorage.setItem('taskflow_user', JSON.stringify(action.payload.user));
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case 'LOGOUT':
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      return { ...state, user: null, token: null, loading: false };
    case 'SET_INITIALIZED':
      return { ...state, initialized: true };
    case 'UPDATE_USER':
      localStorage.setItem('taskflow_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (state.token) {
        try {
          const { data } = await authAPI.getMe();
          dispatch({ type: 'UPDATE_USER', payload: data.user });
        } catch {
          dispatch({ type: 'LOGOUT' });
        }
      }
      dispatch({ type: 'SET_INITIALIZED' });
    };
    verifyToken();
  }, []); // eslint-disable-line

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const { data } = await authAPI.login(credentials);
    dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const { data } = await authAPI.register(userData);
    dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    return data;
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
