import { create } from "zustand";
import { useUserStore } from "../user";

export const useBoardStore = create((set) => ({
  boardMembers: [],

  boardMember: undefined,
  setBoardMember: (boardMember) => set({ boardMember }),

  loadingStates: {},
  setLoadingStates: (loadingStates) => set({ loadingStates: loadingStates }),
  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: isLoading,
      },
    })),

  showDetails: false,
  setShowDetails: (showDetails) => set({ showDetails }),

  getBoardMembers: async () => {
    const { userToken } = useUserStore.getState();
    const { setLoading } = useBoardStore.getState();

    setLoading("BoardPage", true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/board/get-board-members`, {
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
        set({ boardMembers: data.boardMembers });
      }
    } finally {
      setLoading("BoardPage", false);
    }
  },
}));
