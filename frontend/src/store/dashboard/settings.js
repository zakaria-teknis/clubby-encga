import { create } from "zustand";
import { useGlobalStore } from "../global";
import { useUserStore } from "../user";

export const useSettingsStore = create((set) => ({
  passwordIsVerified: false,
  setPasswordIsVerified: (passwordIsVerified) => set({ passwordIsVerified }),

  loadingStates: {},
  setLoadingStates: (loadingStates) => set({ loadingStates: loadingStates }),
  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: isLoading,
      },
    })),

  validationErrors: [],
  setValidationErrors: (validationErrors) =>
    set({ validationErrors: validationErrors }),

  verifyPassword: async (password) => {
    const { userToken } = useUserStore.getState();
    const { setLoading, setPasswordIsVerified } = useSettingsStore.getState();

    setLoading("VerifyPassword", true);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/dashboard/settings/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.validationErrors) {
        set({ validationErrors: data.validationErrors });
        setPasswordIsVerified(false);
      } else if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }

      if (res.ok) {
        set({ validationErrors: [] });
        setPasswordIsVerified(true);
      }
    } finally {
      setLoading("VerifyPassword", false);
    }
  },

  updatePassword: async (password) => {
    const { setSuccess } = useGlobalStore.getState();
    const { userToken } = useUserStore.getState();
    const { setLoading, setPasswordIsVerified } = useSettingsStore.getState();

    setLoading("UpdatePassword", true);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/dashboard/settings/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.validationErrors) {
        set({ validationErrors: data.validationErrors });
      } else if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }

      if (res.ok) {
        setSuccess(data.message);
        set({ validationErrors: [] });
        setPasswordIsVerified(false);
      }
    } finally {
      setLoading("UpdatePassword", false);
    }
  },
}));
