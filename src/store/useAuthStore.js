import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // { id, name, role }
      isAuthenticated: false,
      login: (credentials) => {
        // Mock login
        if (credentials.email && credentials.password) {
          set({
            user: { id: 'admin_1', name: 'Admin', role: 'admin' },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },
      signup: (userData) => {
        set({
          user: { id: 'admin_1', name: userData.name, role: 'admin' },
          isAuthenticated: true,
        });
        return true;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'pos-auth-storage',
    }
  )
);
