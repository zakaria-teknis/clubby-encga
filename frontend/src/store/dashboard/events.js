import { create } from "zustand";
import { useGlobalStore } from "../global";
import { useUserStore } from "../user";

export const useEventsStore = create((set) => ({
  events: [],
  setEvents: (events) => set({ events }),

  event: null,
  setEvent: (event) => set({ event }),

  validationErrors: [],
  setValidationErrors: (validationErrors) => set({ validationErrors }),

  loadingStates: {},
  setLoadingStates: (loadingStates) => set({ loadingStates: loadingStates }),
  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: isLoading,
      },
    })),

  showCreateEventModal: false,
  setShowCreateEventModal: (showCreateEventModal) => {
    set({ showCreateEventModal });
  },

  showEditEventModal: false,
  setShowEditEventModal: (showEditEventModal) => {
    set({ showEditEventModal });
  },

  getEvents: async () => {
    const { userToken } = useUserStore.getState();
    const { setLoading } = useEventsStore.getState();

    setLoading("EventsPage", true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/events/get-events`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        set({ events: data.events });
      }

      if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("EventsPage", false);
    }
  },

  createEvent: async (
    coverImage,
    logo,
    name,
    date,
    time,
    location,
    googleMapsLink,
    entry,
    internalTicketPrice,
    externalTicketPrice,
    ticketStands,
    programSteps,
    guests
  ) => {
    const { setSuccess, setError } = useGlobalStore.getState();
    const { userToken } = useUserStore.getState();
    const { setLoading } = useEventsStore.getState();

    setLoading("CreateEventModal", true);

    if (
      (logo && logo.size > 2 * 1024 * 1024) ||
      (coverImage && coverImage.size > 2 * 1024 * 1024) ||
      (guests &&
        guests.length > 0 &&
        guests.some(
          (guest) =>
            guest.guestImage instanceof File &&
            guest.guestImage.size > 2 * 1024 * 1024
        ))
    ) {
      setLoading("CreateEventModal", false);
      setError("All images should be less than 2MB in size");
      return;
    }

    if (
      (logo && logo.type !== "image/png" && logo.type !== "image/jpeg") ||
      (coverImage &&
        coverImage.type !== "image/png" &&
        coverImage.type !== "image/jpeg") ||
      (guests &&
        guests.length > 0 &&
        guests.some(
          (guest) =>
            guest.guestImage instanceof File &&
            guest.guestImage.type !== "image/png" &&
            guest.guestImage.type !== "image/jpeg"
        ))
    ) {
      setLoading("CreateEventModal", false);
      setError("All images should be of type PNG or JPG");
      return;
    }

    const formData = new FormData();
    if (coverImage) formData.append("coverImage", coverImage);
    if (logo) formData.append("logo", logo);

    formData.append("name", name);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("location", location);
    formData.append("googleMapsLink", googleMapsLink);
    formData.append("entry", entry);
    formData.append("internalTicketPrice", internalTicketPrice);
    formData.append("externalTicketPrice", externalTicketPrice);
    formData.append("ticketStands", JSON.stringify(ticketStands));
    formData.append("programSteps", JSON.stringify(programSteps));

    guests.forEach((guest) => {
      if (guest.guestImage instanceof File) {
        formData.append(
          "guestImages",
          guest.guestImage,
          `guest-${guest.id}-${guest.guestImage.name}`
        );
      }
    });

    formData.append(
      "guests",
      JSON.stringify({
        guests: guests.map((guest) => ({
          id: guest.id,
          fullName: guest.fullName,
          instagram: guest.instagram,
          linkedin: guest.linkedin,
          description: guest.description,
        })),
      })
    );

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/events/add-event`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        set({ validationErrors: [] });
        set((state) => ({
          events: [...state.events, data.event],
        }));
      }

      if (data.validationErrors) {
        set({ validationErrors: data.validationErrors });
      } else if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("CreateEventModal", false);
    }
  },

  updateEvent: async (
    removeCoverImage,
    removeLogo,
    coverImage,
    logo,
    name,
    date,
    time,
    location,
    googleMapsLink,
    entry,
    internalTicketPrice,
    externalTicketPrice,
    ticketStands,
    programSteps,
    guests
  ) => {
    const { setSuccess, setError } = useGlobalStore.getState();
    const { userToken } = useUserStore.getState();
    const { setLoading, event } = useEventsStore.getState();

    setLoading("EditEventModal", true);

    const formData = new FormData();
    if (coverImage) formData.append("coverImage", coverImage);
    if (logo) formData.append("logo", logo);
    formData.append("removeCoverImage", removeCoverImage);
    formData.append("removeLogo", removeLogo);

    formData.append("eventId", event._id);
    formData.append("name", name);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("location", location);
    formData.append("googleMapsLink", googleMapsLink);
    formData.append("entry", entry);
    formData.append("internalTicketPrice", internalTicketPrice);
    formData.append("externalTicketPrice", externalTicketPrice);
    formData.append("ticketStands", JSON.stringify(ticketStands));
    formData.append("programSteps", JSON.stringify(programSteps));

    guests.forEach((guest) => {
      if (guest.guestImage instanceof File) {
        formData.append(
          "guestImages",
          guest.guestImage,
          `guest-${guest.id}-${guest.guestImage.name}`
        );
      }
    });

    formData.append(
      "guests",
      JSON.stringify({
        guests: guests.map((guest) => ({
          id: guest.id,
          fullName: guest.fullName,
          instagram: guest.instagram,
          linkedin: guest.linkedin,
          description: guest.description,
          removeGuestImage: guest.removeGuestImage,
        })),
      })
    );

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/events/edit-event`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Event updated successfully");
        set({ validationErrors: [] });
        set((state) => ({
          events: state.events.map((event) =>
            event._id === data.event._id ? { ...data.event } : event
          ),
        }));
        set((state) => ({ event: { ...state.event, ...data.event } }));
      }

      if (data.validationErrors) {
        set({ validationErrors: data.validationErrors });
      } else if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("EditEventModal", false);
    }
  },

  deleteEvent: async (eventId) => {
    const { setSuccess } = useGlobalStore.getState();
    const { userToken } = useUserStore.getState();
    const { setLoading } = useEventsStore.getState();

    setLoading("EventsPage", true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/events/delete-event?eventId=${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        set((state) => ({
          events: state.events.filter((event) => event._id !== eventId),
        }));
      }

      if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("EventsPage", false);
    }
  },
}));
