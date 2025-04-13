import { Form, Button } from "react-bootstrap";
import { FaXmark } from "react-icons/fa6";
import { useEventsStore } from "../../../store/dashboard/events";
import { useUserStore } from "../../../store/user";

export default function EventTicketStand({
  id,
  index,
  setTicketStands,
  ticketStands,
}) {
  const { validationErrors } = useEventsStore();
  const { user } = useUserStore();
  const createEventModalisLoading = useEventsStore(
    (state) => state.loadingStates["CreateEventModal"]
  );
  const editEventModalisLoading = useEventsStore(
    (state) => state.loadingStates["EditEventModal"]
  );

  const today = new Date().toISOString().split("T")[0];

  const stand = ticketStands.find((stand) => stand.id === id);

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  const validationErrorElement = (element, array) => {
    return (
      validationErrors &&
      validationErrors.some(
        (error) =>
          error.element.includes(element) &&
          error.id === id &&
          error.array === array
      )
    );
  };

  const validationErrorMessage = (element, array) => {
    const error =
      validationErrors &&
      validationErrors.find(
        (error) =>
          error.element.includes(element) &&
          error.id === id &&
          error.array === array
      );
    return error.message;
  };

  const handleStartTimeDisabled = () => {
    return ticketStands.some((stand) => stand.id === id && stand.date === "");
  };

  const handleEndTimeDisabled = () => {
    return ticketStands.some(
      (stand) => stand.id === id && stand.startTime === ""
    );
  };

  const handleDeleteStand = () => {
    setTicketStands((prevTicketStands) =>
      prevTicketStands.filter((ticketStand) => ticketStand.id !== id)
    );
  };

  const updateStandProperty = (property, value) => {
    setTicketStands((prevTicketStands) =>
      prevTicketStands.map((stand) =>
        stand.id === id ? { ...stand, [property]: value } : stand
      )
    );
  };

  return (
    <div className="rounded p-3 shadow d-flex flex-column gap-4">
      <div className="border-bottom pb-3 d-flex justify-content-between">
        <h6 className="fw-bold">Ticket Stand {index + 1}</h6>
        {userIsEditor() && (
          <Button
            variant="light"
            disabled={createEventModalisLoading || editEventModalisLoading}
            onClick={handleDeleteStand}
            className="rounded-circle d-flex align-items-center p-1">
            <FaXmark size={16} />
          </Button>
        )}
      </div>

      <div className="d-flex flex-column flex-sm-row gap-3">
        <Form.Group className="flex-grow-1">
          <Form.Label className="fw-bold">Date</Form.Label>
          <Form.Control
            type="date"
            disabled={createEventModalisLoading || editEventModalisLoading}
            value={stand.date}
            plaintext={!userIsEditor()}
            readOnly={!userIsEditor()}
            min={today}
            onChange={(e) => updateStandProperty("date", e.target.value)}
            isInvalid={validationErrorElement("date", "ticket_stands")}
          />
          {validationErrorElement("date", "ticket_stands") && (
            <Form.Text className="text-danger">
              {validationErrorMessage("date", "ticket_stands")}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="flex-grow-1">
          <Form.Label className="fw-bold">From</Form.Label>
          <Form.Control
            type="time"
            value={stand.startTime}
            plaintext={!userIsEditor()}
            readOnly={!userIsEditor()}
            disabled={
              handleStartTimeDisabled() ||
              createEventModalisLoading ||
              editEventModalisLoading
            }
            onChange={(e) => updateStandProperty("startTime", e.target.value)}
            isInvalid={validationErrorElement("start_time", "ticket_stands")}
          />
          {validationErrorElement("start_time", "ticket_stands") && (
            <Form.Text className="text-danger">
              {validationErrorMessage("start_time", "ticket_stands")}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="flex-grow-1">
          <Form.Label className="fw-bold">To</Form.Label>
          <Form.Control
            disabled={
              handleEndTimeDisabled() ||
              createEventModalisLoading ||
              editEventModalisLoading
            }
            type="time"
            value={stand.endTime}
            plaintext={!userIsEditor()}
            readOnly={!userIsEditor()}
            onChange={(e) => updateStandProperty("endTime", e.target.value)}
            isInvalid={validationErrorElement("end_time", "ticket_stands")}
          />
          {validationErrorElement("end_time", "ticket_stands") && (
            <Form.Text className="text-danger">
              {validationErrorMessage("end_time", "ticket_stands")}
            </Form.Text>
          )}
        </Form.Group>
      </div>

      <div className="d-flex flex-column flex-sm-row gap-3">
        <Form.Group className="flex-grow-1">
          <Form.Label className="fw-bold">Location</Form.Label>
          <Form.Control
            type="text"
            disabled={createEventModalisLoading || editEventModalisLoading}
            value={stand.location}
            plaintext={!userIsEditor()}
            readOnly={!userIsEditor()}
            maxLength={150}
            placeholder={
              !userIsEditor() && !stand.location
                ? "No location provided"
                : "Location"
            }
            onChange={(e) => updateStandProperty("location", e.target.value)}
            isInvalid={validationErrorElement("location", "ticket_stands")}
          />
          {validationErrorElement("location", "ticket_stands") && (
            <Form.Text className="text-danger">
              {validationErrorMessage("location", "ticket_stands")}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="flex-grow-1">
          <Form.Label className="fw-bold">Google Maps Link</Form.Label>
          <Form.Control
            type="text"
            disabled={createEventModalisLoading || editEventModalisLoading}
            value={stand.googleMapsLink}
            plaintext={!userIsEditor()}
            readOnly={!userIsEditor()}
            maxLength={500}
            placeholder={
              !userIsEditor() && !stand.googleMapsLink
                ? "No link provided"
                : "Google Maps link (optional)"
            }
            onChange={(e) =>
              updateStandProperty("googleMapsLink", e.target.value)
            }
            isInvalid={validationErrorElement(
              "google_maps_link",
              "ticket_stands"
            )}
          />
          {validationErrorElement("google_maps_link", "ticket_stands") && (
            <Form.Text className="text-danger">
              {validationErrorMessage("google_maps_link", "ticket_stands")}
            </Form.Text>
          )}
        </Form.Group>
      </div>
    </div>
  );
}
