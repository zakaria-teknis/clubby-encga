import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useClubsStore } from "../../store/public/clubs";
import ClubCard from "./ClubCard";
import ClubCardPlaceholder from "./ClubCardPlaceholder";

export default function ClubList() {
  const { getClubs, clubs } = useClubsStore();
  const isLoading = useClubsStore((state) => state.loadingStates["ClubsList"]);

  useEffect(() => {
    getClubs();
  }, []);

  return (
    <Container fluid className="p-0">
      <div className="max-w-5xl px-4 py-5 mx-auto">
        <h1 className="fw-bold mb-5">Clubs</h1>
        <div className="d-flex flex-wrap justify-content-center">
          {isLoading ? (
            <>
              {Array.from({ length: 12 }).map((_, index) => (
                <ClubCardPlaceholder key={index} />
              ))}
            </>
          ) : (
            clubs.map((club) => (
              <ClubCard key={club._id} logo={club.logo_url} name={club.name} />
            ))
          )}
        </div>
      </div>
    </Container>
  );
}
