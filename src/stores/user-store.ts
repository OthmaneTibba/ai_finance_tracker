import { create } from "zustand";
import { User } from "../models/user";

interface UserState {
  user: User;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    email: "",
    isLogged: false,
  },
  setUser: (user: User) => set({ user }),
}));
