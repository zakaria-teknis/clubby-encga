import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Modal,
  Button,
  Form,
  Image,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useEventsStore } from "../../../store/dashboard/events";
import { BsImageFill, BsTrash3Fill } from "react-icons/bs";
import { FaXmark, FaPlus } from "react-icons/fa6";
import defaultLogo from "../../../assets/images/default-logo.png";
import defaultEventCoverImage from "../../../assets/images/default-event-cover-image.png";
import classes from "./EventModal.module.css";
import EventTicketStand from "./EventTicketStand";
import EventProgramStep from "./EventProgramStep";
import EventGuest from "./EventGuest";
import SuccessToast from "../../SuccessToast";

export default function CreateEventModal() {
  const {
    showCreateEventModal,
    setShowCreateEventModal,
    createEvent,
    validationErrors,
    setValidationErrors,
  } = useEventsStore();
  const isLoading = useEventsStore(
    (state) => state.loadingStates["CreateEventModal"]
  );

  const coverImageRef = useRef(null);
  const logoRef = useRef(null);

  const [coverImage, setCoverImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [entry, setEntry] = useState("");
  const [internalTicketPrice, setInternalTicketPrice] = useState("");
  const [externalTicketPrice, setExternalTicketPrice] = useState("");
  const [ticketStands, setTicketStands] = useState([]);
  const [programSteps, setProgramSteps] = useState([]);
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    return () => {
      if (coverImage) {
        URL.revokeObjectURL(coverImage);
      }
    };
  }, [coverImage]);

  useEffect(() => {
    return () => {
      if (logo) {
        URL.revokeObjectURL(logo);
      }
    };
  }, [logo]);

  const validationErrorElement = (element) => {
    return (
      validationErrors &&
      validationErrors.some(
        (error) => !error.array && error.element.includes(element)
      )
    );
  };

  const validationErrorMessage = (element) => {
    const error =
      validationErrors &&
      validationErrors.find((error) => error.element.includes(element));
    return error.message;
  };

  const formatString = (string) => {
    return string
      .replace(/\s+/g, " ")
      .trim()
      .split(/[-\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const removeExtraWhitespace = (string) => {
    return string
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, (char) => char.toUpperCase());
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSetTicketPrice = (e, setTicketPriceState) => {
    if (e.target.value === "") {
      setTicketPriceState("");
      return;
    } else if (e.target.value < 1) {
      setTicketPriceState(1);
    } else if (e.target.value > 999) {
      setTicketPriceState(999);
    } else {
      setTicketPriceState(e.target.value);
    }
  };

  const handleChangeImage = (
    event,
    setImageState,
    currentImage,
    fileInputRef
  ) => {
    const file = event.target.files[0];
    if (file) {
      if (currentImage) {
        URL.revokeObjectURL(currentImage);
      }

      setImageState(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSetEntryPaid = () => {
    setEntry("paid");
  };

  const handleSetEntryFree = () => {
    setEntry("free");
    setTicketStands([]);
  };

  const handleAddTicketStand = () => {
    setTicketStands([
      ...ticketStands,
      {
        id: uuidv4(),
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        googleMapsLink: "",
      },
    ]);
  };

  const handleAddProgramStep = () => {
    setProgramSteps([
      ...programSteps,
      {
        id: uuidv4(),
        title: "",
        date: "",
        time: "",
        description: "",
      },
    ]);
  };

  const handleAddGuest = () => {
    setGuests([
      ...guests,
      {
        id: uuidv4(),
        fullName: "",
        instagram: "",
        linkedin: "",
        description: "",
        guestImage: "",
      },
    ]);
  };

  const handleCloseModal = () => {
    setShowCreateEventModal(false);
    setValidationErrors([]);
  };

  const addTicketStandDisabled = () => {
    return ticketStands && ticketStands.length >= 10;
  };

  const addProgramStepDisabled = () => {
    return programSteps && programSteps.length >= 10;
  };

  const addGuestDisabled = () => {
    return guests && guests.length >= 6;
  };

  const handleSuccessToastEnter = () => {
    setCoverImage(null);
    setLogo(null);
    setName("");
    setDate("");
    setTime("");
    setLocation("");
    setGoogleMapsLink("");
    setEntry("");
    setInternalTicketPrice("");
    setExternalTicketPrice("");
    setTicketStands([]);
    setProgramSteps([
      {
        id: uuidv4(),
        title: "",
        date: "",
        time: "",
        description: "",
      },
    ]);
    setGuests([]);
  };

  const handleCreateEvent = () => {
    createEvent(
      coverImage,
      logo,
      removeExtraWhitespace(name),
      date,
      time,
      removeExtraWhitespace(location),
      googleMapsLink,
      entry,
      internalTicketPrice,
      externalTicketPrice,
      ticketStands.map((stand) => ({
        ...stand,
        location: removeExtraWhitespace(stand.location),
      })),
      programSteps.map((step) => ({
        ...step,
        title: removeExtraWhitespace(step.title),
        description: removeExtraWhitespace(step.description),
      })),
      guests.map((guest) => ({
        ...guest,
        fullName: formatString(guest.fullName),
        description: removeExtraWhitespace(guest.description),
      }))
    );
  };

  return (
    <>
      <SuccessToast handleSuccessToastEnter={handleSuccessToastEnter} />
      <Modal size="lg" show={showCreateEventModal}>
        <Modal.Header className="d-flex justify-content-between">
          <Modal.Title>Create event</Modal.Title>
          <Button
            variant="light"
            disabled={isLoading}
            className="rounded-circle d-flex align-items-center p-1"
            onClick={handleCloseModal}>
            <FaXmark size={20} />
          </Button>
        </Modal.Header>
        <Modal.Body
          className="d-flex flex-column gap-4 overflow-auto"
          style={{ maxHeight: "70vh" }}>
          <div
            className="position-relative w-100"
            style={{ height: "fit-content", marginBottom: "102px" }}>
            <Image
              className="position-relative"
              src={
                coverImage
                  ? URL.createObjectURL(coverImage)
                  : defaultEventCoverImage
              }
              fluid
            />

            <div
              className="d-flex gap-2 justify-content-start justify-content-sm-around position-absolute"
              style={{ width: "fit-content", bottom: "8px", right: "8px" }}>
              <Button
                size="sm"
                variant="primary"
                disabled={isLoading}
                className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2 position-relative">
                <BsImageFill />
                <span className="d-none d-lg-inline-block">Change</span>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    handleChangeImage(
                      e,
                      setCoverImage,
                      coverImage,
                      coverImageRef
                    )
                  }
                  ref={coverImageRef}
                  accept="image/*"
                  name="profile-image"
                  className="position-absolute opacity-0 w-100 h-100 top-0 start-0"
                />
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={!coverImage || isLoading}
                onClick={() => setCoverImage(null)}
                className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2">
                <BsTrash3Fill />
                <span className="d-none d-lg-inline-block">Remove</span>
              </Button>
            </div>

            <div
              className={`d-flex flex-column flex-sm-row align-items-center gap-sm-3 position-absolute ${classes.logoContainer}`}
              style={{ bottom: "-102px", left: "16px" }}>
              <Image
                src={logo ? URL.createObjectURL(logo) : defaultLogo}
                roundedCircle
                fluid
                className="w-4xs h-4xs mb-3 align-self-center border border-dark-subtle border-2"
              />
              <div
                className="d-flex gap-2 justify-content-start justify-content-sm-around"
                style={{ width: "fit-content" }}>
                <Button
                  size="sm"
                  variant="outline-primary"
                  disabled={isLoading}
                  className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2 position-relative">
                  <BsImageFill />
                  <span className="d-none d-sm-inline-block">Change</span>
                  <Form.Control
                    type="file"
                    onChange={(e) =>
                      handleChangeImage(e, setLogo, logo, logoRef)
                    }
                    ref={logoRef}
                    accept="image/*"
                    name="profile-image"
                    className="position-absolute opacity-0 w-100 h-100 top-0 start-0"
                  />
                </Button>
                <Button
                  size="sm"
                  variant="outline-primary"
                  disabled={!logo || isLoading}
                  onClick={() => setLogo(null)}
                  className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2">
                  <BsTrash3Fill />
                  <span className="d-none d-sm-inline-block">Remove</span>
                </Button>
              </div>
            </div>
          </div>

          <Form className="d-flex flex-column gap-3">
            <Form.Group className="w-100 border-bottom pb-4">
              <Form.Label className="fw-bold">Name</Form.Label>
              <Form.Control
                type="text"
                disabled={isLoading}
                value={name}
                maxLength={100}
                onChange={(e) => setName(e.target.value)}
                placeholder="Give your event a name"
                isInvalid={validationErrorElement("name")}
              />
              {validationErrorElement("name") && (
                <Form.Text className="text-danger">
                  {validationErrorMessage("name")}
                </Form.Text>
              )}
            </Form.Group>

            <div className="d-flex flex-column flex-sm-row gap-3 border-bottom pb-4">
              <Form.Group className="w-100 w-sm-50">
                <Form.Label className="fw-bold">Date</Form.Label>
                <Form.Control
                  type="date"
                  disabled={isLoading}
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  isInvalid={validationErrorElement("date")}
                />
                {validationErrorElement("date") && (
                  <Form.Text className="text-danger">
                    {validationErrorMessage("date")}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="w-100 w-sm-50">
                <Form.Label className="fw-bold">Time</Form.Label>
                <Form.Control
                  type="time"
                  value={time}
                  disabled={!date || isLoading}
                  onChange={(e) => setTime(e.target.value)}
                  isInvalid={validationErrorElement("time")}
                />
                {validationErrorElement("time") && (
                  <Form.Text className="text-danger">
                    {validationErrorMessage("time")}
                  </Form.Text>
                )}
              </Form.Group>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-3 border-bottom pb-4">
              <Form.Group className="flex-grow-1">
                <Form.Label className="fw-bold">Location</Form.Label>
                <Form.Control
                  type="text"
                  disabled={isLoading}
                  value={location}
                  maxLength={150}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  isInvalid={validationErrorElement("location")}
                />
                {validationErrorElement("location") && (
                  <Form.Text className="text-danger">
                    {validationErrorMessage("location")}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="flex-grow-1">
                <Form.Label className="fw-bold">Google Maps Link</Form.Label>
                <Form.Control
                  type="text"
                  value={googleMapsLink}
                  disabled={isLoading}
                  maxLength={500}
                  onChange={(e) => setGoogleMapsLink(e.target.value)}
                  placeholder="Google Maps link (optional)"
                  isInvalid={validationErrorElement("google_maps_link")}
                />
                {validationErrorElement("google_maps_link") && (
                  <Form.Text className="text-danger">
                    {validationErrorMessage("google_maps_link")}
                  </Form.Text>
                )}
              </Form.Group>
            </div>

            <Form.Group className="w-100 border-bottom pb-4">
              <Form.Label className="fw-bold">Entry</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Free"
                  disabled={isLoading}
                  name="entry"
                  type="radio"
                  id="inline-radio-free"
                  checked={entry === "free"}
                  onChange={handleSetEntryFree}
                  isInvalid={validationErrorElement("entry")}
                />
                <Form.Check
                  inline
                  label="Paid"
                  disabled={isLoading}
                  name="entry"
                  type="radio"
                  id="inline-radio-paid"
                  checked={entry === "paid"}
                  onChange={handleSetEntryPaid}
                  isInvalid={validationErrorElement("entry")}
                />
              </div>
              {validationErrorElement("entry") && (
                <Form.Text className="text-danger">
                  {validationErrorMessage("entry")}
                </Form.Text>
              )}
            </Form.Group>

            {entry === "paid" && (
              <div className="d-flex flex-column gap-4 border-bottom pb-4">
                <div className="d-flex flex-column flex-sm-row gap-3 border-bottom pb-4">
                  <Form.Group className="flex-grow-1">
                    <Form.Label className="fw-bold">
                      Internal Ticket Price
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>MAD</InputGroup.Text>
                      <Form.Control
                        type="number"
                        disabled={isLoading}
                        value={internalTicketPrice}
                        onChange={(e) =>
                          handleSetTicketPrice(e, setInternalTicketPrice)
                        }
                        placeholder="Enter internal ticket price"
                        isInvalid={validationErrorElement(
                          "internal_ticket_price"
                        )}
                      />
                    </InputGroup>
                    {validationErrorElement("internal_ticket_price") && (
                      <Form.Text className="text-danger">
                        {validationErrorMessage("internal_ticket_price")}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group className="flex-grow-1">
                    <Form.Label className="fw-bold">
                      External Ticket Price
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>MAD</InputGroup.Text>
                      <Form.Control
                        type="number"
                        disabled={isLoading}
                        value={externalTicketPrice}
                        onChange={(e) =>
                          handleSetTicketPrice(e, setExternalTicketPrice)
                        }
                        placeholder="Enter external ticket price"
                        isInvalid={validationErrorElement(
                          "external_ticket_price"
                        )}
                      />
                    </InputGroup>
                    {validationErrorElement("external_ticket_price") && (
                      <Form.Text className="text-danger">
                        {validationErrorMessage("external_ticket_price")}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fw-bold mb-0">Ticket Stands</h6>
                  <Button
                    size="sm"
                    disabled={isLoading || addTicketStandDisabled()}
                    onClick={handleAddTicketStand}
                    variant="primary"
                    className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2">
                    <FaPlus />
                    <span>Add Stand</span>
                  </Button>
                </div>
                {ticketStands &&
                  ticketStands.length > 0 &&
                  ticketStands.map((ticketStand, index) => (
                    <EventTicketStand
                      key={ticketStand.id}
                      id={ticketStand.id}
                      index={index}
                      setTicketStands={setTicketStands}
                      ticketStands={ticketStands}
                    />
                  ))}
              </div>
            )}

            <div className="d-flex flex-column gap-4 border-bottom pb-4">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="fw-bold mb-0">Program</h6>
                <Button
                  size="sm"
                  disabled={isLoading || addProgramStepDisabled()}
                  onClick={handleAddProgramStep}
                  variant="primary"
                  className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2">
                  <FaPlus />
                  <span>Add Step</span>
                </Button>
              </div>
              {programSteps &&
                programSteps.length > 0 &&
                programSteps.map((programStep, index) => (
                  <EventProgramStep
                    key={programStep.id}
                    id={programStep.id}
                    index={index}
                    setProgramSteps={setProgramSteps}
                    programSteps={programSteps}
                  />
                ))}
            </div>

            <div className="d-flex flex-column gap-4 pb-4">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="fw-bold mb-0">Guests</h6>
                <Button
                  size="sm"
                  disabled={isLoading || addGuestDisabled()}
                  onClick={handleAddGuest}
                  variant="primary"
                  className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2">
                  <FaPlus />
                  <span>Add Guest</span>
                </Button>
              </div>
              {guests &&
                guests.length > 0 &&
                guests.map((guest, index) => (
                  <EventGuest
                    key={guest.id}
                    id={guest.id}
                    index={index}
                    setGuests={setGuests}
                    guests={guests}
                  />
                ))}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            disabled={isLoading}
            onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={isLoading}
            className="d-flex align-items-center gap-2"
            onClick={handleCreateEvent}>
            {isLoading && (
              <Spinner animation="border" variant="light" size="sm" />
            )}
            <span>Create Event</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
