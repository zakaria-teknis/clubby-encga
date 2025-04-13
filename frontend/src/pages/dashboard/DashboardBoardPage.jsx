import { useEffect } from "react";
import React from "react";
import { Container } from "react-bootstrap";
import { useBoardStore } from "../../store/dashboard/board";
import BoardCard from "../../components/dashboard/board/BoardCard";
import BoardCardPlaceholder from "../../components/dashboard/board/BoardCardPlaceholder";
import BoardCardDetails from "../../components/dashboard/board/BoardCardDetails";
import DashboardNavBar from "../../components/dashboard/DashboardNavBar";

export default function DashboardBoardPage() {
  const { getBoardMembers, boardMembers, setLoadingStates, boardMember } =
    useBoardStore();
  const isLoading = useBoardStore((state) => state.loadingStates["BoardPage"]);

  useEffect(() => {
    getBoardMembers();

    return () => {
      setLoadingStates({});
    };
  }, []);

  return (
    <Container fluid className="px-4 py-5 max-w-5xl">
      {boardMember && <BoardCardDetails />}
      <h2 className="mb-2 fw-bold">Board</h2>
      <p className="mb-5 text-body-secondary">Your fellow board members.</p>
      <div className="d-flex flex-wrap gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <BoardCardPlaceholder key={index} />
            ))
          : boardMembers &&
            boardMembers.length > 0 &&
            boardMembers.map((boardMember) => (
              <BoardCard
                key={boardMember._id}
                boardMemberId={boardMember._id}
                profileImage={boardMember.profile_image_url || ""}
                firstName={boardMember.first_name}
                lastName={boardMember.last_name}
                email={boardMember.email}
                phone={boardMember.phone || ""}
                club={boardMember.club}
                boardPosition={boardMember.board_position}
                description={boardMember.description || ""}
                instagram={boardMember.instagram || ""}
                linkedin={boardMember.linkedin || ""}
                facebook={boardMember.facebook || ""}
              />
            ))}
      </div>
    </Container>
  );
}
