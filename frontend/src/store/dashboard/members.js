import { create } from "zustand";
import { useGlobalStore } from "../global";
import { useUserStore } from "../user";

export const useMembersStore = create((set) => ({
  members: [],
  setMembers: (members) => set({ members }),

  orderedMembers: [],
  setOrderedMembers: (orderedMembers) => set({ orderedMembers }),

  loadingStates: {},
  setLoadingStates: (loadingStates) => set({ loadingStates }),
  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: isLoading,
      },
    })),

  member: null,
  setMember: (member) => set({ member }),

  validationErrors: [],
  setValidationErrors: (validationErrors) => set({ validationErrors }),

  showAddMemberModal: false,
  setShowAddMemberModal: (showAddMemberModal) => {
    set({ showAddMemberModal });
  },

  showEditMemberModal: false,
  setShowEditMemberModal: (showEditMemberModal) => {
    set({ showEditMemberModal });
  },

  getMembers: async () => {
    const { userToken } = useUserStore.getState();
    const { setLoading } = useMembersStore.getState();

    setLoading("MembersTable", true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/members/get-members`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        set({ members: data.members });
        set({ orderedMembers: data.members });
      }

      if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("MembersTable", false);
    }
  },

  addMember: async (
    firstName,
    lastName,
    email,
    phone,
    paidMembershipFee,
    profileImage
  ) => {
    const { setSuccess, setError } = useGlobalStore.getState();
    const { userToken } = useUserStore.getState();
    const { setLoading } = useMembersStore.getState();

    setLoading("AddMemberModal", true);

    if (profileImage && profileImage.size > 2 * 1024 * 1024) {
      setLoading("AddMemberModal", false);
      return setError("Image should be less than 2MB in size");
    }

    if (
      profileImage &&
      profileImage.type !== "image/png" &&
      profileImage.type !== "image/jpeg"
    ) {
      setLoading("AddMemberModal", false);
      return setError("Image should be of type PNG or JPG");
    }

    const formData = new FormData();
    formData.append("file", profileImage);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("paidMembershipFee", paidMembershipFee);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/members/add-member`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        set((state) => ({
          members: [...state.members, data.member],
        }));
        set((state) => ({
          orderedMembers: [...state.orderedMembers, data.member],
        }));
        set({ validationErrors: [] });
      }

      if (data.validationErrors) {
        set({ validationErrors: data.validationErrors });
      } else if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("AddMemberModal", false);
    }
  },

  updateMember: async (
    firstName,
    lastName,
    email,
    phone,
    paidMembershipFee,
    profileImage,
    removeImage
  ) => {
    const { setSuccess, setError } = useGlobalStore.getState();
    const { userToken } = useUserStore.getState();
    const { setLoading, member } = useMembersStore.getState();

    setLoading("EditMemberModal", true);

    if (profileImage && profileImage.size > 2 * 1024 * 1024) {
      setLoading("EditMemberModal", false);
      setError("Image should be less than 2MB in size");
      return;
    }

    if (
      profileImage &&
      profileImage.type !== "image/png" &&
      profileImage.type !== "image/jpeg"
    ) {
      setLoading("EditMemberModal", false);
      setError("Image should be of type PNG or JPG");
      return;
    }

    const formData = new FormData();
    formData.append("file", profileImage);
    formData.append("memberId", member._id);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("removeImage", removeImage);
    formData.append("paidMembershipFee", paidMembershipFee);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/members/update-member`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        set((state) => ({
          members: state.members.map((member) =>
            member._id === data.member._id ? { ...data.member } : member
          ),
        }));
        set((state) => ({ member: { ...state.member, ...data.member } }));
        set((state) => ({
          orderedMembers: state.orderedMembers.map((orderedMember) =>
            orderedMember._id === data.member._id
              ? { ...data.member }
              : orderedMember
          ),
        }));
        set({ validationErrors: [] });
      }

      if (data.validationErrors) {
        set({ validationErrors: data.validationErrors });
      } else if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("EditMemberModal", false);
    }
  },

  deleteMember: async (memberId) => {
    const { setSuccess } = useGlobalStore.getState();
    const { userToken } = useUserStore.getState();
    const { setLoading } = useMembersStore.getState();

    setLoading("MembersTable", true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/members/delete-member?memberId=${memberId}`,
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
          members: state.members.filter((member) => member._id !== memberId),
        }));
        set((state) => ({
          orderedMembers: state.orderedMembers.filter(
            (member) => member._id !== memberId
          ),
        }));
      }

      if (res.status === 401) {
        window.location.href = "/login";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("MembersTable", false);
    }
  },
}));
