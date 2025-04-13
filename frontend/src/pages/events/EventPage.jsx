import { useEffect } from "react";
import { Container, Image, Placeholder } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEventsStore } from "../../store/public/events";
import classes from "./EventPage.module.css";
import { FaCalendarDays, FaLocationDot, FaClock } from "react-icons/fa6";
import { SiGooglemaps } from "react-icons/si";
import { IoTicket } from "react-icons/io5";
import { FaSquareInstagram, FaLinkedin } from "react-icons/fa6";
import defaultProfileImage from "../../assets/images/default-profile-image.png";
import eventCoverImagePlaceholder from "../../assets/images/event-cover-image-placeholder.png";

export default function EventPage() {
  const { event, getEventPageInfo } = useEventsStore();
  const isLoading = useEventsStore((state) => state.loadingStates["EventPage"]);

  const { clubName } = useParams();
  const { eventNameSlug } = useParams();

  useEffect(() => {
    getEventPageInfo(clubName, eventNameSlug);
  }, []);

  return (
    <Container
      fluid
      className="p-0"
      style={{ minHeight: "calc(100vh - 72px)" }}>
      <Container fluid className="p-0">
        <div
          className="mx-auto rounded-bottom position-relative"
          style={{ maxWidth: "calc(1280px - 48px)" }}>
          <Image
            className="rounded-bottom"
            src={isLoading ? eventCoverImagePlaceholder : event.cover_image_url}
            style={{ maxHeight: "60vh" }}
          />
          {event.logo_url && (
            <Image
              className={`${classes.logoContainer} w-4xs h-4xs position-absolute border border-2`}
              src={event.logo_url}
              roundedCircle
              style={{ bottom: "-64px", left: "24px" }}
            />
          )}
        </div>
        <div className="max-w-5xl px-4 pt-3 mx-auto d-flex justify-content-center justify-content-md-start">
          {isLoading ? (
            <Placeholder as="h1" className="w-3xs" />
          ) : (
            <h1
              className={`${event.logo_url && classes.eventName} fw-bold`}
              style={{ marginTop: event.logo_url ? "72px" : "0" }}>
              {event.name}
            </h1>
          )}
        </div>
      </Container>

      <div className="d-flex flex-column gap-5 py-5">
        <Container fluid className="p-0">
          <div className="max-w-5xl px-4 mx-auto">
            <div className="d-flex flex-wrap justify-content-center gap-4">
              <div className="p-4 border flex-grow-1 rounded bg-light-subtle">
                <h3 className="fw-bold mb-4">Date & Time</h3>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <FaCalendarDays size={24} className="flex-shrink-0" />
                    {isLoading ? (
                      <Placeholder as="h5" className="w-3xs" />
                    ) : (
                      <h5 className=" mb-0">
                        Starts on{" "}
                        {new Date(event.date).toLocaleDateString("fr-FR")}
                      </h5>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FaClock size={24} className="flex-shrink-0" />
                    {isLoading ? (
                      <Placeholder as="h5" className="w-5xs" />
                    ) : (
                      <h5 className=" mb-0">At {event.time}</h5>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border flex-grow-1 rounded bg-light-subtle">
                <h3 className="fw-bold mb-4">Location</h3>
                <div className="d-flex flex-column gap-3">
                  {isLoading ? (
                    <Placeholder as="h5" className="w-3xs" />
                  ) : (
                    event.location && (
                      <div className="d-flex align-items-center gap-2">
                        <FaLocationDot size={24} className="flex-shrink-0" />
                        <h5 className=" mb-0">{event.location}</h5>
                      </div>
                    )
                  )}
                  {event.google_maps_link && (
                    <div className="d-flex align-items-center gap-2">
                      <SiGooglemaps size={24} className="flex-shrink-0" />
                      <a
                        className="fw-semibold fs-5 lh-sm"
                        target="_blank"
                        href={event.google_maps_link}>
                        Google Maps Location
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border flex-grow-1 rounded bg-light-subtle">
                <h3 className="fw-bold mb-4">Entry</h3>
                <div className="d-flex flex-column gap-3">
                  {isLoading ? (
                    <Placeholder as="h5" className="w-3xs" />
                  ) : event.entry === "free" ? (
                    <div className="d-flex align-items-center gap-2">
                      <IoTicket size={24} className="flex-shrink-0" />
                      <h5 className=" mb-0">Free Entry</h5>
                    </div>
                  ) : (
                    <>
                      {event.internal_ticket_price && (
                        <div className="d-flex align-items-center gap-2">
                          <IoTicket size={24} className="flex-shrink-0" />
                          <h5 className=" mb-0">
                            Internals: {event.internal_ticket_price} DH
                          </h5>
                        </div>
                      )}
                      {event.external_ticket_price && (
                        <div className="d-flex align-items-center gap-2">
                          <IoTicket size={24} className="flex-shrink-0" />
                          <h5 className=" mb-0">
                            Externals: {event.external_ticket_price} DH
                          </h5>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>

        {event.ticket_stands && event.ticket_stands.length > 0 && (
          <Container fluid className="p-0">
            <div className="max-w-5xl px-4 mx-auto">
              <div className="p-4 border rounded bg-light-subtle">
                <h3 className="fw-bold mb-4">Ticket Stands</h3>
                <div className="d-flex gap-4 flex-wrap justify-content-center">
                  {event.ticket_stands.map((stand, index) => (
                    <div
                      key={index}
                      className="d-flex flex-column gap-3 border p-3"
                      style={{ width: "fit-content" }}>
                      <h4 className="fw-bold">Stand {index + 1}</h4>
                      <div className="d-flex flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <FaCalendarDays size={20} className="flex-shrink-0" />
                          <h6 className=" mb-0">
                            {new Date(stand.date).toLocaleDateString("fr-FR")}
                          </h6>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <FaClock size={20} className="flex-shrink-0" />
                          <h6 className=" mb-0">
                            From {stand.start_time} to {stand.end_time}
                          </h6>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FaLocationDot size={20} className="flex-shrink-0" />
                        <h6 className=" mb-0">{stand.location}</h6>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <SiGooglemaps size={20} className="flex-shrink-0" />
                        <a
                          className="fw-semibold"
                          target="_blank"
                          href={event.google_maps_link}>
                          Google Maps Location
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        )}

        {event.program_steps && event.program_steps.length > 0 && (
          <Container fluid className="p-0">
            <div className="max-w-5xl px-4 mx-auto">
              <div className="p-4 border rounded bg-light-subtle">
                <h3 className="fw-bold mb-4">Program</h3>
                <div className="d-flex gap-4 flex-wrap justify-content-center">
                  {event.program_steps.map((step, index) => (
                    <div
                      key={index}
                      className="d-flex flex-column gap-3 border p-3"
                      style={{ width: "fit-content" }}>
                      <h4 className="fw-bold">{step.title}</h4>
                      <div className="d-flex flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <FaCalendarDays size={20} className="flex-shrink-0" />
                          <h6 className=" mb-0">
                            {new Date(step.date).toLocaleDateString("fr-FR")}
                          </h6>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <FaClock size={20} className="flex-shrink-0" />
                          <h6 className=" mb-0">At {step.time}</h6>
                        </div>
                      </div>
                      <div className="border-top pt-3">
                        <p className="mb-0">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        )}

        {event.guests && event.guests.length > 0 && (
          <Container fluid className="p-0">
            <div className="max-w-5xl px-4 mx-auto">
              <div className="p-4 border rounded bg-light-subtle">
                <h3 className="fw-bold mb-4">Guests</h3>
                <div className="d-flex gap-4 flex-wrap justify-content-center">
                  {event.guests.map((guest, index) => (
                    <div
                      key={index}
                      className="d-flex flex-column gap-3 border p-3 w-2xs">
                      <Image
                        className="w-4xs h-4xs align-self-center"
                        src={
                          guest.guest_image_url
                            ? guest.guest_image_url
                            : defaultProfileImage
                        }
                        roundedCircle
                      />
                      <h5 className="text-center fw-bold">{guest.full_name}</h5>
                      {guest.description && (
                        <div className="border-top pt-3">
                          <p className="mb-0">{guest.description}</p>
                        </div>
                      )}
                      {(guest.instagram || guest.linkedin) && (
                        <div className="d-flex justify-content-center gap-3 border-top pt-3">
                          {guest.instagram && (
                            <a
                              href={guest.instagram}
                              target="_blank"
                              className="text-body">
                              <FaSquareInstagram size={28} />
                            </a>
                          )}
                          {guest.linkedin && (
                            <a href={guest.linkedin} className="text-body">
                              <FaLinkedin size={28} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        )}
      </div>
    </Container>
  );
}
