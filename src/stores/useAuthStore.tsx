import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userId: string | null;
  userName: string | null;
  setAuth: (userId: string, userName: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      userName: null,
      isAuthenticated: false,
      setAuth: (userId, userName) =>
        set({ userId, userName, isAuthenticated: true }),
      logout: () =>
        set({ userId: null, userName: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
