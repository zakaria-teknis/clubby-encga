import { useEffect } from "react";
import { Container } from "react-bootstrap";
import UpcomingEventCard from "./UpcomingEventCard";
import UpcomingEventCardPlaceholder from "./UpcomingEventCardPlaceholder";
import { useEventsStore } from "../../store/public/events";
import { GiSadCrab } from "react-icons/gi";

export default function EventList() {
  const { getEvents, events } = useEventsStore();
  const isLoading = useEventsStore(
    (state) => state.loadingStates["EventsList"]
  );

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <Container fluid className="p-0">
      <div className="max-w-5xl px-4 py-5 mx-auto">
        <h1 className="fw-bold mb-5">Events</h1>
        {events &&
          (isLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <UpcomingEventCardPlaceholder key={index} />
            ))
          ) : events.length === 0 ? (
            <div className="d-flex flex-column align-items-center text-body-tertiary">
              <GiSadCrab size={80} className="mb-2" />
              <h6 className="text-center mb-0">No upcoming events</h6>
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {events.map((event) => (
                <UpcomingEventCard
                  key={event._id}
                  clubName={event.club}
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
    </Container>
  );
}
