import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { useToastContext } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToastContext();

  // Restore session from token on application startup
  const loadAuth = useCallback(async () => {
    try {
      setLoading(true);
      const [user, users] = await Promise.all([
        authService.getCurrentUser(),
        authService.getUsers()
      ]);
      setCurrentUser(user);
      setAllUsers(users || []);
    } catch (err) {
      console.error('Error loading auth state:', err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  // Real backend login
  const login = async (email, password) => {
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      toast.success(`Welcome back, ${user.name}!`);
      return user;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  // Real backend registration
  const register = async (formData) => {
    try {
      const user = await authService.register(formData);
      setCurrentUser(user);
      toast.success(`Account created! Welcome to RentWise, ${user.name}.`);
      return user;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  // Real logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout warning:', err);
    } finally {
      setCurrentUser(null);
      toast.info('You have been signed out.');
    }
  };

  // Profile update
  const updateProfile = async (updates) => {
    if (!currentUser) return;
    try {
      const updated = await authService.updateProfile(currentUser.id, updates);
      setCurrentUser(updated);
      toast.success('Profile updated successfully!');
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const isCustomer = currentUser?.role === 'customer';
  const isVendor = currentUser?.role === 'vendor';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        loading,
        isCustomer,
        isVendor,
        login,
        register,
        logout,
        updateProfile,
        refreshAuth: loadAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
