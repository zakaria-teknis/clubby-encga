import { create } from "zustand";

export const useGlobalStore = create((set) => ({
  isLoading: false,
  error: "",
  succes: "",

  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error }),
  setSuccess: (success) => set({ success: success }),
}));
