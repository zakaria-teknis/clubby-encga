import { Card, Button, Image } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { BsTrash3Fill, BsFillEyeFill } from "react-icons/bs";
import { useEventsStore } from "../../../store/dashboard/events";
import { useUserStore } from "../../../store/user";

export default function EventCard({
  eventId,
  coverImage,
  logo,
  name,
  date,
  time,
}) {
  const { events, setEvent, setShowEditEventModal, deleteEvent } =
    useEventsStore();
  const { user } = useUserStore();

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  const formatTitle = (title, maxLength = 20) => {
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
  };

  const handleEdit = () => {
    setEvent(events.find((event) => event._id === eventId));
    setShowEditEventModal(true);
  };

  const handleDelete = () => {
    deleteEvent(eventId);
  };

  return (
    <Card className="w-sm h-md">
      <div
        className="position-relative w-100 h-50"
        style={{ height: "fit-content", marginBottom: "77px" }}>
        {coverImage ? (
          <Card.Img className="h-100" variant="top" src={coverImage} />
        ) : (
          <Image className="h-100 bg-body-secondary" variant="top" />
        )}
        {logo ? (
          <Image
            src={logo}
            roundedCircle
            fluid
            className="w-5xs h-5xs position-absolute border border-dark-subtle border-2"
            style={{ bottom: "-77px", left: "16px" }}
          />
        ) : (
          <Image
            roundedCircle
            fluid
            className="w-5xs h-5xs position-absolute bg-body-secondary border border-dark-subtle border-2"
            style={{ bottom: "-77px", left: "16px" }}
          />
        )}
      </div>
      <Card.Body>
        <Card.Title className="fw-bold">{formatTitle(name)}</Card.Title>
        <Card.Text>
          Starts on{" "}
          <span className="fw-semibold">
            {new Date(date).toLocaleDateString("fr-FR")}
          </span>{" "}
          at <span className="fw-semibold">{time}</span>
        </Card.Text>
        <div className="d-flex gap-2">
          <Button
            onClick={handleEdit}
            variant="primary"
            className="d-flex align-items-center justify-content-center gap-1">
            {userIsEditor() ? (
              <>
                <FaEdit />
                <span>Edit</span>
              </>
            ) : (
              <>
                <BsFillEyeFill />
                <span>View</span>
              </>
            )}
          </Button>
          {userIsEditor() && (
            <Button
              onClick={handleDelete}
              variant="outline-danger"
              className="d-flex align-items-center justify-content-center gap-1">
              <BsTrash3Fill />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
