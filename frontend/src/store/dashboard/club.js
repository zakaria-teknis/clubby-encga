import { create } from "zustand";
import { useGlobalStore } from "../global";
import { useUserStore } from "../user";

export const useClubStore = create((set) => ({
  club: null,
  setClub: (club) => set({ club }),

  loadingStates: {},
  setLoadingStates: (loadingStates) => set({ loadingStates }),
  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: isLoading,
      },
    })),

  validationErrors: [],
  setValidationErrors: (validationErrors) => set({ validationErrors }),

  updateClubInfo: async (
    email,
    phone,
    description,
    website,
    instagram,
    linkedin,
    facebook
  ) => {
    const { setSuccess } = useGlobalStore.getState();
    const { userToken } = useUserStore.getState();
    const { club, setClub, setLoading } = useClubStore.getState();

    setLoading("ClubForm", true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/club/update-club-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          clubId: club._id,
          email,
          phone,
          description,
          website,
          instagram,
          linkedin,
          facebook,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        setClub(data.club);
      }

      if (data.validationErrors) {
        set({ validationErrors: data.validationErrors });
      } else if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("ClubForm", false);
    }
  },

  updateClubLogo: async (logo) => {
    const { setSuccess } = useGlobalStore.getState();
    const { userToken } = useUserStore.getState();
    const { club, setClub, setLoading } = useClubStore.getState();

    setLoading("ClubLogo", true);

    if (logo.size > 2 * 1024 * 1024) {
      setLoading("ClubLogo", false);
      return setError("Image should be less than 2MB in size");
    }

    if (logo.type !== "image/png" && logo.type !== "image/jpeg") {
      setLoading("ClubLogo", false);
      return setError("Image should be of type PNG or JPG");
    }

    const formData = new FormData();
    formData.append("file", logo);
    formData.append("clubId", club._id);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/club/update-club-logo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }

      if (res.ok) {
        setSuccess(data.message);
        setClub({
          ...useClubStore.getState().club,
          logo_url: data.logoUrl,
        });
      }
    } finally {
      setLoading("ClubLogo", false);
    }
  },

  deleteClubLogo: async () => {
    const { setSuccess } = useGlobalStore.getState();
    const { userToken } = useUserStore.getState();
    const { club, setClub, setLoading } = useClubStore.getState();

    setLoading("ClubLogo", true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/club/delete-club-logo?clubId=${club._id}`,
        {
          method: "DELETE",
          headers: {
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
        setClub({
          ...useClubStore.getState().club,
          logo_url: data.logoUrl,
        });
      }
    } finally {
      setLoading("ClubLogo", false);
    }
  },
}));
