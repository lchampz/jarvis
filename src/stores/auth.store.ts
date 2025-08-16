import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IAuthStore } from '../types/auth.types';

export const useAuth = create<IAuthStore>()(
    persist(
        (set) => ({
            token: undefined,
            isAuthenticated: false,
            id: undefined,
            isAdmin: false,
            login: (token: string, id: string, isAdmin: boolean) => {
                set({
                    isAuthenticated: true,
                    token: token,
                    id: id,
                    isAdmin: isAdmin
                })
            },
            logout: () => set({
                isAuthenticated: false,
                token: undefined,
                id: undefined,
                isAdmin: false
            })
        }),
        {
            name: 'auth-storage'
        }
    )
);