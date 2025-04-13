import { create } from "zustand";
import { useGlobalStore } from "./global";
import { useClubStore } from "./dashboard/club";

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  loadingStates: {},
  setLoadingStates: (loadingStates) => set({ loadingStates: loadingStates }),
  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: isLoading,
      },
    })),

  userToken: JSON.parse(localStorage.getItem("token")) || null,

  approvedUserEmail: "",

  validationErrors: [],
  setValidationErrors: (validationErrors) =>
    set({ validationErrors: validationErrors }),

  requestSignupUser: async (
    first_name,
    last_name,
    club,
    board_position,
    isEditor,
    phone,
    email
  ) => {
    const { setSuccess } = useGlobalStore.getState();
    const { setLoading } = useUserStore.getState();

    setLoading("RequestSignupPage", true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/request-signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name,
            last_name,
            club,
            board_position,
            phone,
            isEditor,
            email,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        set({ validationErrors: [] });
      }

      if (!res.ok) {
        if (data.validationErrors) {
          set({ validationErrors: data.validationErrors });
        } else window.location.href = "/error/general";
      }
    } finally {
      setLoading("RequestSignupPage", false);
    }
  },

  signupUser: async (email, password) => {
    const { setLoading } = useUserStore.getState();
    const { setClub } = useClubStore.getState();

    setLoading("SignupPage", true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", JSON.stringify(data.token));
        set({ userToken: data.token });
        set({ user: data.user });
        setClub(data.club);
      }

      if (!res.ok) {
        if (data.validationErrors) {
          set({ validationErrors: data.validationErrors });
        } else window.location.href = "/error/general";
      }
    } finally {
      setLoading("SignupPage", false);
    }
  },

  loginUser: async (email, password) => {
    const { setLoading } = useUserStore.getState();
    const { setClub } = useClubStore.getState();

    setLoading("LoginPage", true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", JSON.stringify(data.token));
        set({ userToken: data.token });
        set({ user: data.user });
        setClub(data.club);
      }

      if (!res.ok) {
        if (data.validationErrors) {
          set({ validationErrors: data.validationErrors });
        } else window.location.href = "/error/general";
      }
    } finally {
      setLoading("LoginPage", false);
    }
  },

  getUser: async () => {
    const { userToken } = useUserStore.getState();
    const { setLoading } = useUserStore.getState();
    const { setClub } = useClubStore.getState();

    setLoading("NavBar", true);

    if (!userToken) {
      setLoading("NavBar", false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/get-user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        set({ user: data.user });
        setClub(data.club);
      }

      if (res.status === 401) {
        localStorage.removeItem("token");
        set({ user: null });
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("NavBar", false);
    }
  },

  logoutUser: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },

  getApprovedUser: async (token) => {
    const { setLoading } = useUserStore.getState();

    setLoading("SignupPage", true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/get-approved-user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        set({ approvedUserEmail: data.user.email });
      }

      if (res.status === 401 || res.status === 404) {
        window.location.href = "/error/expired-signup-link";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("SignupPage", false);
    }
  },
}));
