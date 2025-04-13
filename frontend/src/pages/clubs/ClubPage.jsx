import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Image, Placeholder } from "react-bootstrap";
import { GiSadCrab } from "react-icons/gi";
import {
  FaPeopleGroup,
  FaGlobe,
  FaSquareInstagram,
  FaSquarePhone,
  FaSquareFacebook,
  FaLinkedin,
} from "react-icons/fa6";
import { BiSolidParty } from "react-icons/bi";
import { IoMdMail } from "react-icons/io";
import { useClubsStore } from "../../store/public/clubs";
import ClubPageBoardCard from "../../components/clubs/ClubPageBoardCard";
import ClubPageBoardCardPlaceholder from "../../components/clubs/ClubPageBoardCardPlaceholder";
import ClubPageBoardCardDetails from "../../components/clubs/ClubPageBoardCardDetails";
import UpcomingEventCard from "../../components/events/UpcomingEventCard";
import UpcomingEventCardPlaceholder from "../../components/events/UpcomingEventCardPlaceholder";

export default function ClubPage() {
  const {
    club,
    boardMember,
    boardMembers,
    membersCount,
    upcomingEventsCount,
    getClubPageInfo,
    setLoadingStates,
    upcomingEvents,
  } = useClubsStore();
  const isLoading = useClubsStore((state) => state.loadingStates["ClubPage"]);

  const { clubName } = useParams();

  useEffect(() => {
    getClubPageInfo(clubName);

    return () => {
      setLoadingStates({});
    };
  }, []);

  const formatClub = (club) => {
    if (club) {
      let formattedClub = club;

      formattedClub = formattedClub
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      if (club === "jlm") formattedClub = "Jeunes Leaders Marocains";
      if (club === "cop") formattedClub = "Club d'Orientation Pédagogique";
      if (club === "cdi") formattedClub = "Club du Digital et de l'Innovation";
      if (club === "rcc") formattedClub = "Readers' Corner Club";
      if (club === "sport-for-dev") formattedClub = "Sport For Development";
      if (club === "is-club") formattedClub = "International Student Club";
      if (club === "jtc") formattedClub = "Junior Traders Club";

      return formattedClub;
    }
  };

  return (
    <>
      {boardMember && <ClubPageBoardCardDetails />}

      <Container fluid className="p-0" style={{ minHeight: "calc(100vh - 72px)" }}>
        <Container fluid className="p-0 bg-body-tertiary">
          <div className="max-w-5xl px-4 py-5 mx-auto d-flex flex-column flex-sm-row justify-content-between align-items-center gap-5">
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
              <Image
                src={isLoading ? "" : club.logo_url}
                className="border flex-shrink-0 bg-body-secondary w-4xs h-4xs border-primary-subtle"
                roundedCircle
              />
              <div className="d-flex flex-column align-items-center align-items-sm-start gap-2">
                <div className="d-flex align-items-center gap-2">
                  <FaPeopleGroup size={24} />
                  {isLoading ? (
                    <Placeholder as="span" className="w-5xs" />
                  ) : (
                    <span className="fw-semibold">
                      {membersCount === 0
                        ? "No members found"
                        : membersCount === 1
                        ? `${membersCount} member`
                        : `${membersCount} members`}
                    </span>
                  )}
                </div>
                {isLoading ? (
                  <Placeholder as="h2" className="w-2xs" />
                ) : (
                  <h2 className="text-center text-sm-start fw-bold">
                    {formatClub(club.name)}
                  </h2>
                )}
                <div className="d-flex align-items-center gap-2">
                  <BiSolidParty size={24} />
                  {isLoading ? (
                    <Placeholder as="span" className="w-4xs" />
                  ) : (
                    <span className="fw-semibold">
                      {upcomingEventsCount === 0
                        ? "No upcoming events"
                        : upcomingEventsCount === 1
                        ? `${upcomingEventsCount} upcoming event`
                        : `${upcomingEventsCount} upcoming events`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isLoading ? (
              <Placeholder as="h2" className="w-4xs" />
            ) : (
              club &&
              (club.instagram ||
                club.linkedin ||
                club.facebook ||
                club.website) && (
                <div
                  className="d-flex align-items-center justify-content-center flex-wrap gap-4"
                  style={{ width: "fit-content" }}>
                  {club.instagram && (
                    <a href={club.instagram} className="text-body">
                      <FaSquareInstagram size={28} />
                    </a>
                  )}
                  {club.linkedin && (
                    <a href={club.linkedin} className="text-body">
                      <FaLinkedin size={28} />
                    </a>
                  )}
                  {club.facebook && (
                    <a href={club.facebook} className="text-body">
                      <FaSquareFacebook size={28} />
                    </a>
                  )}
                  {club.website && (
                    <a href={club.website} className="text-body">
                      <FaGlobe size={28} />
                    </a>
                  )}
                </div>
              )
            )}
          </div>
        </Container>

        <div className="d-flex flex-column gap-5 py-5">
          {club && (club.email || club.phone) && (
            <Container fluid className="p-0">
              <div className="max-w-5xl px-4 mx-auto">
                <div className="p-4 border rounded bg-light-subtle">
                  <h3 className="fw-bold mb-4">Contact</h3>
                  <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
                    {club.email && (
                      <div className="d-flex align-items-center gap-2">
                        <IoMdMail className="flex-shrink-0" size={24} />
                        <span className="fw-semibold">{club.email}</span>
                      </div>
                    )}
                    {club.phone && (
                      <div className="d-flex align-items-center gap-2">
                        <FaSquarePhone className="flex-shrink-0" size={24} />
                        <span className="fw-semibold">{club.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Container>
          )}

          <Container fluid className="p-0">
            <div className="max-w-5xl px-4 mx-auto">
              <div className="p-4 border rounded bg-light-subtle">
                <h3 className="fw-bold mb-4">Description</h3>
                {isLoading ? (
                  <>
                    <Placeholder as="p" className="w-100" />
                    <Placeholder as="p" className="w-100" />
                    <Placeholder as="p" className="w-75" />
                  </>
                ) : (
                  <p className="mb-0">{club.description}</p>
                )}
              </div>
            </div>
          </Container>

          <Container fluid className="p-0">
            <div className="max-w-5xl px-4 mx-auto">
              <div className="pt-4 px-4 border rounded bg-light-subtle">
                <h3 className="fw-bold mb-4">Board</h3>
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  {isLoading
                    ? Array.from({ length: 7 }).map((_, index) => (
                        <ClubPageBoardCardPlaceholder key={index} />
                      ))
                    : boardMembers.map((boardMember) => (
                        <ClubPageBoardCard
                          key={boardMember._id}
                          id={boardMember._id}
                          firstName={boardMember.first_name}
                          lastName={boardMember.last_name}
                          boardPosition={boardMember.board_position}
                          profileImage={boardMember.profile_image_url}
                        />
                      ))}
                </div>
              </div>
            </div>
          </Container>

          <Container fluid className="p-0">
            <div className="max-w-5xl px-4 mx-auto">
              <div className="p-4 border rounded bg-light-subtle">
                <h3 className="fw-bold mb-4">Upcoming events</h3>
                {upcomingEvents &&
                  (isLoading ? (
                    Array.from({ length: 2 }).map((_, index) => (
                      <UpcomingEventCardPlaceholder key={index} />
                    ))
                  ) : upcomingEvents.length === 0 ? (
                    <div className="py-2 d-flex flex-column align-items-center text-body-tertiary">
                      <GiSadCrab size={80} className="mb-2" />
                      <h6 className="text-center mb-0">No upcoming events</h6>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-4">
                      {upcomingEvents.map((event) => (
                        <UpcomingEventCard
                          key={event._id}
                          clubName={club.name}
                          eventName={event.name}
                          eventNameSlug={event.name_slug}
                          coverImage={event.cover_image_url}
                          logo={event.logo_url}
                          date={event.date}
                          time={event.time}
                          entry={event.entry}
                          internalTicketPrice={event.internal_ticket_price}
                          externalTicketPrice={event.external_ticket_price}
                        />
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          </Container>
        </div>
      </Container>
    </>
  );
}
