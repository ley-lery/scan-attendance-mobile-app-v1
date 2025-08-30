import { create } from "zustand";

type Location = {
    latitude: number;
    longitude: number;
};

type State = {
    location: Location;
    setLocation: (loc: Location) => void;
};

export const useGetLocationStore = create<State>((set) => ({
    location: { latitude: 0, longitude: 0 },
    setLocation: (loc: Location) => set({ location: loc }),
}));
