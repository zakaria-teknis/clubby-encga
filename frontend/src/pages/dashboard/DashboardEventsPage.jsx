import { useEffect } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { RiErrorWarningFill, RiInformation2Fill } from "react-icons/ri";
import { useEventsStore } from "../../store/dashboard/events";
import { useGlobalStore } from "../../store/global";
import { useUserStore } from "../../store/user";
import undrawEvents from "../../assets/images/undraw-events.svg";
import CreateEventModal from "../../components/dashboard/events/CreateEventModal";
import EventCard from "../../components/dashboard/events/EventCard";
import EventCardPlaceholder from "../../components/dashboard/events/EventCardPlaceholder";
import EditEventModal from "../../components/dashboard/events/EditEventModal";
import ErrorToast from "../../components/ErrorToast";

export default function DashboardEventsPage() {
  const {
    setShowCreateEventModal,
    setLoadingStates,
    events,
    getEvents,
    event,
  } = useEventsStore();
  const { user } = useUserStore();
  const { setError, setSuccess } = useGlobalStore();
  const isLoading = useEventsStore(
    (state) => state.loadingStates["EventsPage"]
  );

  useEffect(() => {
    getEvents();
    return () => {
      setLoadingStates({});
      setSuccess("");
      setError("");
    };
  }, [getEvents]);

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  const displayWarning = () => {
    return (
      userIsEditor() &&
      events &&
      events.length > 0 &&
      events.some((event) => !event.cover_image_url)
    );
  };

  const createEventDisabled = () => {
    return userIsEditor() && events && events.length >= 10;
  };

  return (
    <>
      <ErrorToast />
      {event && <EditEventModal />}
      <CreateEventModal />

      <Container fluid className="px-4 py-5 max-w-5xl d-flex flex-column">
        <h2 className="mb-2 fw-bold">Events</h2>
        <p className="mb-5 text-body-secondary">
          Create and manage your club's events.
        </p>
        {displayWarning() && (
          <Alert
            className="d-flex align-items-center gap-1"
            key="warning"
            variant="warning">
            <RiErrorWarningFill className="flex-shrink-0" size={24} />
            <span>
              Events without a <b>cover image</b> will not be visible to
              visitors. Make sure to include one.
            </span>
          </Alert>
        )}
        {createEventDisabled() && (
          <Alert
            className="d-flex align-items-center gap-1"
            key="info"
            variant="info">
            <RiInformation2Fill className="flex-shrink-0" size={24} />
            <span>
              You can't add more than <b>10 events</b>.
            </span>
          </Alert>
        )}
        {userIsEditor() && (
          <Button
            className="mb-3 d-flex align-items-center justify-content-center gap-1"
            style={{ width: "fit-content" }}
            disabled={isLoading || createEventDisabled()}
            onClick={() => setShowCreateEventModal(true)}>
            <FaPlus />
            <span>Create event</span>
          </Button>
        )}

        {isLoading ? (
          <div className="d-flex flex-wrap gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <EventCardPlaceholder key={index} />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="d-flex flex-wrap gap-5">
            {events.map((event) => (
              <EventCard
                key={event._id}
                eventId={event._id}
                coverImage={event.cover_image_url}
                logo={event.logo_url}
                name={event.name}
                date={event.date}
                time={event.time}
              />
            ))}
          </div>
        ) : (
          <>
            <img
              className="max-w-2xs mb-2 align-self-center"
              src={undrawEvents}
            />
            {userIsEditor() ? (
              <p className="fw-semibold mb-0 text-center">
                It's empty in here...
              </p>
            ) : (
              <p className="fw-semibold mb-0 text-center">No events found</p>
            )}
            {userIsEditor() && (
              <span
                className="text-primary text-decoration-underline align-self-center"
                style={{ cursor: "pointer" }}
                onClick={() => setShowCreateEventModal(true)}>
                Create an event.
              </span>
            )}
          </>
        )}
      </Container>
    </>
  );
}
