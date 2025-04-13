import { create } from "zustand";

export const useEventsStore = create((set) => ({
  loadingStates: {},
  setLoadingStates: (loadingStates) => set({ loadingStates: loadingStates }),
  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: isLoading,
      },
    })),

  events: [],
  setEvents: (events) => set({ events }),

  event: {},
  setEvent: (event) => set({ event }),

  clubLogo: "",
  setClubLogo: (clubLogo) => set({ clubLogo }),

  getEvents: async () => {
    const { setLoading } = useEventsStore.getState();

    setLoading("EventsList", true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/public/events/get-events`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        set({ events: data.events });
      }

      if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("EventsList", false);
    }
  },

  getEventPageInfo: async (clubName, eventNameSlug) => {
    const { setLoading } = useEventsStore.getState();

    setLoading("EventPage", true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/public/events/get-event/${clubName}/${eventNameSlug}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        set({ event: data.event });
      }

      if (res.status === 404) {
        window.location.href = "/error/page-not-found";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("EventPage", false);
    }
  },
}));
