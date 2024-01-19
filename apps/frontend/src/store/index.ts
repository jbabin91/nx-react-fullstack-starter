import { create } from 'zustand';

import type { IUser } from '../libs/types';

type AuthStore = {
  authUser: IUser | null;
  setAuthUser: (user: IUser | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),
}));
