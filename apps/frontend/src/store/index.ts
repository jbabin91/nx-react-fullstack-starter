import { create } from 'zustand';

import type { IUser } from '../libs/types';

type AuthStore = {
  authUser: IUser | null | undefined;
  pageLoading: boolean;
  setAuthUser: (user: IUser) => void;
  setPageLoading: (isLoading: boolean) => void;
  status: 'loggedOut' | 'loggedIn';
  login: (user: IUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  login: (user) =>
    set((state) => ({ ...state, authUser: user, status: 'loggedIn' })),
  logout: () =>
    set((state) => ({ ...state, authUser: null, status: 'loggedOut' })),
  pageLoading: false,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),
  setPageLoading: (isLoading) =>
    set((state) => ({ ...state, pageLoading: isLoading })),
  status: 'loggedOut',
}));
