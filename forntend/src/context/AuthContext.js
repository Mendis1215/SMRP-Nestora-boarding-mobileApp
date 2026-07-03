import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (token) {
        // Fetch user details from backend using the token
        const response = await api.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      console.log('Error restoring session:', error);
      // If token is invalid/expired, clear it
      await AsyncStorage.removeItem('userToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      await AsyncStorage.setItem('userToken', token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, ...newUserData } = response.data;
      
      await AsyncStorage.setItem('userToken', token);
      setUser(newUserData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUser(null);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
