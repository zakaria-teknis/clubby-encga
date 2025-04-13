import { create } from "zustand";
import { useGlobalStore } from "../global";
import { useUserStore } from "../user";

export const useProfileStore = create((set) => ({
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

  updateProfileInfo: async (
    first_name,
    last_name,
    email,
    phone,
    description,
    instagram,
    linkedin,
    facebook
  ) => {
    const { setSuccess } = useGlobalStore.getState();
    const { userToken, setUser } = useUserStore.getState();
    const { setLoading } = useProfileStore.getState();

    setLoading("ProfileForm", true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/profile/update-profile-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          phone,
          description,
          instagram,
          linkedin,
          facebook,
        }),
      });

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
        setUser(data.user);
      }
    } finally {
      setLoading("ProfileForm", false);
    }
  },

  updateProfileImage: async (profileImage) => {
    const { setError, setSuccess } = useGlobalStore.getState();
    const { userToken, setUser } = useUserStore.getState();
    const { setLoading } = useProfileStore.getState();

    setLoading("ProfileImage", true);

    if (profileImage.size > 2 * 1024 * 1024) {
      setLoading("ProfileImage", false);
      return setError("Image should be less than 2MB in size");
    }

    if (
      profileImage.type !== "image/png" &&
      profileImage.type !== "image/jpeg"
    ) {
      setLoading("ProfileImage", false);
      return setError("Image should be of type PNG or JPG");
    }

    const formData = new FormData();
    formData.append("file", profileImage);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/profile/update-profile-image`, {
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
        setUser({
          ...useUserStore.getState().user,
          profile_image_url: data.profileImageUrl,
        });
      }
    } finally {
      setLoading("ProfileImage", false);
    }
  },

  deleteProfileImage: async () => {
    const { setSuccess } = useGlobalStore.getState();
    const { userToken, setUser } = useUserStore.getState();
    const { setLoading } = useProfileStore.getState();

    setLoading("ProfileImage", true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/profile/delete-profile-image`, {
        method: "DELETE",
        headers: {
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
        setSuccess(data.message);
        setUser({
          ...useUserStore.getState().user,
          profile_image_url: "",
        });
      }
    } finally {
      setLoading("ProfileImage", false);
    }
  },
}));
