import { create } from "zustand";

const data = null;

type user = any;
type userState = {
    users: user | null;
    setusers: (users: user | null) => void;
};

export const useUserStore = create<userState>((set) => ({
    users: data,
    setusers: (users) => set({ users }),
}));
