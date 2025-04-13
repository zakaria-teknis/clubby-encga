import { create } from "zustand";

export const useClubsStore = create((set) => ({
  loadingStates: {},
  setLoadingStates: (loadingStates) => set({ loadingStates: loadingStates }),
  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: isLoading,
      },
    })),

  clubs: [],
  setClubs: (clubs) => set({ clubs }),

  boardMembers: [],
  setBoardMembers: (boardMembers) => set({ boardMembers }),

  upcomingEvents: [],
  setUpcomingEvents: (upcomingEvents) => set({ upcomingEvents }),

  membersCount: null,
  setMembersCount: (membersCount) => set({ membersCount }),

  upcomingEventsCount: null,
  setUpcomingEventsCount: (upcomingEventsCount) => set({ upcomingEventsCount }),

  club: {},
  setClub: (club) => set({ club }),

  boardMember: null,
  setBoardMember: (boardMember) => set({ boardMember }),

  showBoardMemberDetails: false,
  setShowBoardMemberDetails: (showBoardMemberDetails) =>
    set({ showBoardMemberDetails }),

  getClubs: async () => {
    const { setLoading } = useClubsStore.getState();

    setLoading("ClubsList", true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/public/clubs/get-clubs`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        set({ clubs: data.clubs });
      }

      if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("ClubsList", false);
    }
  },

  getClubPageInfo: async (clubName) => {
    const { setLoading } = useClubsStore.getState();

    setLoading("ClubPage", true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/public/clubs/get-club/${clubName}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        set({ club: data.club });
        set({ boardMembers: data.boardMembers });
        set({ membersCount: data.membersCount });
        set({ upcomingEventsCount: data.upcomingEventsCount });
        set({ upcomingEvents: data.upcomingEvents });
      }

      if (res.status === 404) {
        window.location.href = "/error/page-not-found";
      } else if (!res.ok) {
        window.location.href = "/error/general";
      }
    } finally {
      setLoading("ClubPage", false);
    }
  },
}));
