import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, phone: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  addEcoPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'ecosahayak_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached user session:', e);
      }
    }
    // Default to Aarav Sharma (Citizen) for out-of-the-box demo
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [currentUser]);

  // Recalculate badge level when points change
  const computeBadgeLevel = (points: number): UserProfile['badgeLevel'] => {
    if (points >= 600) return 'Eco Hero';
    if (points >= 300) return 'Green Guardian';
    if (points >= 100) return 'Eco Warrior';
    return 'Eco Starter';
  };

  const login = async (email: string, forcedRole?: UserRole): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'password123', // default demo password
        });
        if (!error && data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            email: data.user.email || email,
            phone: data.user.user_metadata?.phone || '',
            role: (data.user.user_metadata?.role as UserRole) || forcedRole || 'citizen',
            ecoPoints: 150,
            badgeLevel: 'Eco Warrior',
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(profile);
          return true;
        }
      } catch (err) {
        console.warn('Supabase login failed, using resilient local auth profile:', err);
      }
    }

    // Local / demo fallback lookup
    const existing = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return true;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: forcedRole || (email.includes('admin') ? 'admin' : 'citizen'),
      ecoPoints: 50,
      badgeLevel: 'Eco Starter',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const register = async (name: string, email: string, phone: string, role: UserRole): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: name,
      email,
      phone,
      role,
      ecoPoints: 50, // Welcome signup bonus!
      badgeLevel: 'Eco Starter',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      setCurrentUser(INITIAL_USERS[2]); // Rajesh Verma (Admin)
    } else {
      setCurrentUser(INITIAL_USERS[0]); // Aarav Sharma (Citizen)
    }
  };

  const addEcoPoints = (points: number) => {
    if (!currentUser) return;
    const newTotal = (currentUser.ecoPoints || 0) + points;
    const updated: UserProfile = {
      ...currentUser,
      ecoPoints: newTotal,
      badgeLevel: computeBadgeLevel(newTotal),
    };
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'citizen',
        isAuthenticated: Boolean(currentUser),
        login,
        register,
        logout,
        switchRole,
        addEcoPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
