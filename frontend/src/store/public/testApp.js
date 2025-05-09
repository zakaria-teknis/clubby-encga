import { create } from "zustand";

export const useTestAppStore = create((set) => ({
  showCredentials: false,
  setShowCredentials: (showCredentials) =>
    set({ showCredentials: showCredentials }),
}));
