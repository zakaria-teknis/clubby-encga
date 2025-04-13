import { Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IoTicket } from "react-icons/io5";

export default function UpcomingEventCard({
  clubName,
  eventName,
  eventNameSlug,
  coverImage,
  logo,
  date,
  time,
  entry,
  internalTicketPrice,
  externalTicketPrice,
}) {
  const navigate = useNavigate();

  const formatClub = (club) => {
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
  };

  const handleClick = () => {
    navigate(`/events/${clubName}/${eventNameSlug}`);
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-center border-bottom py-3">
      <div
        className="max-w-xs rounded position-relative"
        style={{ marginTop: logo ? "28px" : "0" }}>
        {logo && (
          <Image
            roundedCircle
            className="w-6xs h-6xs position-absolute"
            style={{ top: "-28px", left: "50%", transform: "translateX(-50%)" }}
            src={logo}
            alt="Event cover image"
          />
        )}
        <Image className="rounded" src={coverImage} alt="Event cover image" />
      </div>
      <div className="d-flex flex-column flex-sm-row gap-4 p-4 justify-content-between align-items-center w-100">
        <div className="d-flex gap-2 flex-column align-items-center align-items-sm-start">
          <h4 className="fw-bold text-center text-sm-start">{eventName}</h4>
          <span>
            By: <span className="fw-semibold">{formatClub(clubName)}</span>
          </span>
          <span className="text-center text-sm-start">
            Starts on{" "}
            <span className="fw-semibold">
              {new Date(date).toLocaleDateString("fr-FR")}
            </span>{" "}
            at <span className="fw-semibold">{time}</span>
          </span>
          {entry === "free" ? (
            <div className="d-flex align-items-center gap-1">
              <IoTicket size={20} />
              <span className="fw-semibold">Free</span>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center align-items-sm-start flex-lg-row gap-2">
              {internalTicketPrice && (
                <div className="d-flex align-items-center gap-1">
                  <IoTicket size={20} />
                  <span className="fw-semibold">
                    Internals: {internalTicketPrice} DH
                  </span>
                </div>
              )}
              {externalTicketPrice && (
                <div className="d-flex align-items-center gap-1">
                  <IoTicket size={20} />
                  <span className="fw-semibold">
                    Externals: {externalTicketPrice} DH
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <Button variant="dark" onClick={handleClick}>
          Details
        </Button>
      </div>
    </div>
  );
}
