import { create } from "zustand";
import { useGlobalStore } from "../global";
import { useUserStore } from "../user";

export const useRequestStore = create((set) => ({
  requests: [],

  loadingStates: {},
  setLoadingStates: (loadingStates) => set({ loadingStates: loadingStates }),
  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: isLoading,
      },
    })),

  getRequests: async () => {
    const { userToken } = useUserStore.getState();
    const { setLoading } = useRequestStore.getState();

    setLoading("RequestsTable", true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/requests/get-requests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await res.json();

      if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }

      if (res.ok) {
        set({ requests: data.requests });
      }
    } finally {
      setLoading("RequestsTable", false);
    }
  },

  approveRequest: async (
    firstName,
    lastName,
    club,
    boardPosition,
    email,
    id
  ) => {
    const { userToken } = useUserStore.getState();
    const { setSuccess } = useGlobalStore.getState();
    const { setLoading } = useRequestStore.getState();

    setLoading("RequestsTable", true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/requests/approve-request`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          id,
          firstName,
          lastName,
          club,
          boardPosition,
          email,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }

      if (res.ok) {
        setSuccess(data.message);
        set((state) => ({
          requests: state.requests.map((request) => {
            if (request._id === id) {
              return { ...request, status: "approved" };
            }
            return request;
          }),
        }));
      }
    } finally {
      setLoading("RequestsTable", false);
    }
  },

  rejectRequest: async (
    firstName,
    lastName,
    club,
    boardPosition,
    email,
    id
  ) => {
    const { userToken } = useUserStore.getState();
    const { setSuccess } = useGlobalStore.getState();
    const { setLoading } = useRequestStore.getState();

    setLoading("RequestsTable", true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/requests/reject-request?id=${id}&firstName=${firstName}&lastName=${lastName}&club=${club}&boardPosition=${boardPosition}&email=${email}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }

      if (res.ok) {
        setSuccess(data.message);
        set((state) => ({
          requests: state.requests.filter((request) => request._id !== id),
        }));
      }
    } finally {
      setLoading("RequestsTable", false);
    }
  },
}));
