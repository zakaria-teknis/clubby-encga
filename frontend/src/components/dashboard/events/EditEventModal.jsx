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
import { useUserStore } from "../../../store/user";
import { BsImageFill, BsTrash3Fill } from "react-icons/bs";
import { FaXmark, FaPlus } from "react-icons/fa6";
import defaultLogo from "../../../assets/images/default-logo.png";
import defaultEventCoverImage from "../../../assets/images/default-event-cover-image.png";
import classes from "./EventModal.module.css";
import EventTicketStand from "./EventTicketStand";
import EventProgramStep from "./EventProgramStep";
import EventGuest from "./EventGuest";
import SuccessToast from "../../SuccessToast";

export default function EditEventModal() {
  const {
    showEditEventModal,
    setShowEditEventModal,
    updateEvent,
    setEvent,
    event,
    validationErrors,
    setValidationErrors,
  } = useEventsStore();
  const { user } = useUserStore();
  const isLoading = useEventsStore(
    (state) => state.loadingStates["EditEventModal"]
  );

  const coverImageRef = useRef(null);
  const logoRef = useRef(null);

  const [coverImage, setCoverImage] = useState(event.cover_image_url);
  const [logo, setLogo] = useState(event.logo_url);
  const [removeCoverImage, setRemoveCoverImage] = useState(false);
  const [removeLogo, setRemoveLogo] = useState(false);

  const [name, setName] = useState(event.name);
  const [date, setDate] = useState(
    new Date(event.date).toISOString().split("T")[0]
  );
  const [time, setTime] = useState(event.time);
  const [location, setLocation] = useState(event.location);
  const [googleMapsLink, setGoogleMapsLink] = useState(event.google_maps_link);
  const [entry, setEntry] = useState(event.entry);
  const [internalTicketPrice, setInternalTicketPrice] = useState(
    event.internal_ticket_price
  );
  const [externalTicketPrice, setExternalTicketPrice] = useState(
    event.external_ticket_price
  );
  const [ticketStands, setTicketStands] = useState(
    event.ticket_stands.map((stand) => ({
      id: stand.id,
      date: new Date(stand.date).toISOString().split("T")[0],
      startTime: stand.start_time,
      endTime: stand.end_time,
      location: stand.location,
      googleMapsLink: stand.google_maps_link,
    }))
  );
  const [programSteps, setProgramSteps] = useState(
    event.program_steps.map((step) => ({
      ...step,
      date: new Date(step.date).toISOString().split("T")[0],
    }))
  );
  const [guests, setGuests] = useState(
    event.guests.map((guest) => ({
      id: guest.id,
      fullName: guest.full_name,
      instagram: guest.instagram,
      linkedin: guest.linkedin,
      description: guest.description,
      guestImage: guest.guest_image_url,
    }))
  );

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

  useEffect(() => {
    if (event.internal_ticket_price === null) {
      setInternalTicketPrice("");
    } else setInternalTicketPrice(event.internal_ticket_price);

    if (event.external_ticket_price === null) {
      setExternalTicketPrice("");
    } else setExternalTicketPrice(event.external_ticket_price);

    return () => {
      setRemoveCoverImage(false);
      setRemoveLogo(false);
      setGuests((prevGuests) =>
        prevGuests.map((guest) => ({
          ...guest,
          removeGuestImage: false,
        }))
      );
    };
  }, [event]);

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

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
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
    setRemoveImageState,
    currentImage,
    fileInputRef
  ) => {
    const file = event.target.files[0];
    if (file) {
      if (currentImage) {
        URL.revokeObjectURL(currentImage);
      }

      setImageState(file);
      setRemoveImageState(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSetEntryPaid = () => {
    setEntry("paid");
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

  const handleRemoveImage = (setImageState, setRemoveImageState) => {
    setImageState("");
    setRemoveImageState(true);
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

  const saveButtonDisabled = () => {
    const ticketStandsChange = ticketStands.every((inputStand) => {
      const eventStand = event.ticket_stands.find(
        (eventStand) => eventStand.id === inputStand.id
      );

      return (
        ticketStands.length === event.ticket_stands.length &&
        eventStand &&
        inputStand.date === eventStand.date &&
        inputStand.startTime === eventStand.start_time &&
        inputStand.endTime === eventStand.end_time &&
        removeExtraWhitespace(inputStand.location) === eventStand.location &&
        inputStand.googleMapsLink === eventStand.google_maps_link
      );
    });

    const programStepsChange = programSteps.every((inputStep) => {
      const eventStep = event.program_steps.find(
        (eventStep) => eventStep.id === inputStep.id
      );

      return (
        programSteps.length === event.program_steps.length &&
        eventStep &&
        removeExtraWhitespace(inputStep.title) === eventStep.title &&
        inputStep.date === eventStep.date &&
        inputStep.time === eventStep.time &&
        removeExtraWhitespace(inputStep.description) === eventStep.description
      );
    });

    const guestsChange = guests.every((inputGuest) => {
      const eventGuest = event.guests.find(
        (eventGuest) => eventGuest.id === inputGuest.id
      );

      return (
        guests.length === event.guests.length &&
        eventGuest &&
        formatString(inputGuest.fullName) === eventGuest.full_name &&
        inputGuest.instagram === eventGuest.instagram &&
        inputGuest.linkedin === eventGuest.linkedin &&
        removeExtraWhitespace(inputGuest.description) ===
          eventGuest.description &&
        inputGuest.guestImage === eventGuest.guest_image_url
      );
    });

    return (
      coverImage === event.cover_image_url &&
      logo === event.logo_url &&
      removeExtraWhitespace(name) === event.name &&
      date === event.date &&
      time === event.time &&
      removeExtraWhitespace(location) === event.location &&
      googleMapsLink === event.google_maps_link &&
      entry === event.entry &&
      internalTicketPrice === (event.internal_ticket_price || "") &&
      externalTicketPrice === (event.external_ticket_price || "") &&
      ticketStandsChange &&
      programStepsChange &&
      guestsChange
    );
  };

  const handleCloseModal = () => {
    setShowEditEventModal(false);
    setEvent(null);
    setValidationErrors([]);
  };

  const handleEditEvent = () => {
    updateEvent(
      removeCoverImage,
      removeLogo,
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
      <SuccessToast />
      <Modal size="lg" show={showEditEventModal}>
        <Modal.Header className="d-flex justify-content-between">
          <Modal.Title>
            {userIsEditor() ? <span>Edit event</span> : <span>View event</span>}
          </Modal.Title>
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
                !coverImage
                  ? defaultEventCoverImage
                  : typeof coverImage === "string"
                  ? coverImage
                  : URL.createObjectURL(coverImage)
              }
              fluid
            />

            {userIsEditor() && (
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
                        setRemoveCoverImage,
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
                  onClick={() =>
                    handleRemoveImage(setCoverImage, setRemoveCoverImage)
                  }
                  className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2">
                  <BsTrash3Fill />
                  <span className="d-none d-lg-inline-block">Remove</span>
                </Button>
              </div>
            )}

            <div
              className={`d-flex flex-column flex-sm-row align-items-center gap-sm-3 position-absolute ${classes.logoContainer}`}
              style={{ bottom: "-102px", left: "16px" }}>
              <Image
                src={
                  !logo
                    ? defaultLogo
                    : typeof logo === "string"
                    ? logo
                    : URL.createObjectURL(logo)
                }
                roundedCircle
                fluid
                className="w-4xs h-4xs mb-3 align-self-center border border-dark-subtle border-2"
              />
              {userIsEditor() && (
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
                        handleChangeImage(
                          e,
                          setLogo,
                          setRemoveLogo,
                          logo,
                          logoRef
                        )
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
                    onClick={() => handleRemoveImage(setLogo, setRemoveLogo)}
                    className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2">
                    <BsTrash3Fill />
                    <span className="d-none d-sm-inline-block">Remove</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Form className="d-flex flex-column gap-3">
            <Form.Group className="w-100 border-bottom pb-4">
              <Form.Label className="fw-bold">Name</Form.Label>
              <Form.Control
                type="text"
                disabled={isLoading}
                value={name}
                plaintext={!userIsEditor()}
                readOnly={!userIsEditor()}
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
                  plaintext={!userIsEditor()}
                  readOnly={!userIsEditor()}
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
                  plaintext={!userIsEditor()}
                  readOnly={!userIsEditor()}
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
                  plaintext={!userIsEditor()}
                  readOnly={!userIsEditor()}
                  maxLength={150}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={
                    !userIsEditor() && !location
                      ? "No location provided"
                      : "Location"
                  }
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
                  plaintext={!userIsEditor()}
                  readOnly={!userIsEditor()}
                  disabled={isLoading}
                  maxLength={500}
                  onChange={(e) => setGoogleMapsLink(e.target.value)}
                  placeholder={
                    !userIsEditor() && !googleMapsLink
                      ? "No link provided"
                      : "Google Maps link (optional)"
                  }
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
              {userIsEditor() ? (
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
              ) : (
                <Form.Control
                  type="text"
                  value={formatString(entry)}
                  plaintext
                  readOnly
                  placeholder={
                    !userIsEditor() && !entry ? "Not provided" : "Entry"
                  }
                />
              )}
              {validationErrorElement("entry") && (
                <Form.Text className="text-danger">
                  {validationErrorMessage("entry")}
                </Form.Text>
              )}
            </Form.Group>

            {ticketStands && ticketStands.length > 0 && (
              <div className="d-flex flex-column gap-4 border-bottom pb-4">
                <div className="d-flex flex-column flex-sm-row gap-3 border-bottom pb-4">
                  <Form.Group className="flex-grow-1">
                    <Form.Label className="fw-bold">
                      Internal Ticket Price
                    </Form.Label>
                    <InputGroup>
                      {userIsEditor() && <InputGroup.Text>MAD</InputGroup.Text>}
                      <div className="d-flex align-items-center gap-1">
                        {!userIsEditor() && <span>MAD</span>}
                        <Form.Control
                          style={{ width: "fit-content" }}
                          type="number"
                          disabled={isLoading}
                          value={internalTicketPrice}
                          plaintext={!userIsEditor()}
                          readOnly={!userIsEditor()}
                          onChange={(e) =>
                            handleSetTicketPrice(e, setInternalTicketPrice)
                          }
                          placeholder="Enter internal ticket price"
                          isInvalid={validationErrorElement(
                            "internal_ticket_price"
                          )}
                        />
                      </div>
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
                      {userIsEditor() && <InputGroup.Text>MAD</InputGroup.Text>}
                      <div className="d-flex align-items-center gap-1">
                        {!userIsEditor() && <span>MAD</span>}
                        <Form.Control
                          type="number"
                          disabled={isLoading}
                          value={externalTicketPrice}
                          plaintext={!userIsEditor()}
                          readOnly={!userIsEditor()}
                          onChange={(e) =>
                            handleSetTicketPrice(e, setExternalTicketPrice)
                          }
                          placeholder="Enter external ticket price"
                          isInvalid={validationErrorElement(
                            "external_ticket_price"
                          )}
                        />
                      </div>
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
                  {userIsEditor() && (
                    <Button
                      size="sm"
                      disabled={isLoading || addTicketStandDisabled()}
                      onClick={handleAddTicketStand}
                      variant="primary"
                      className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2">
                      <FaPlus />
                      <span>Add Stand</span>
                    </Button>
                  )}
                </div>
                {ticketStands.map((ticketStand, index) => (
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

            {programSteps && programSteps.length > 0 && (
              <div className="d-flex flex-column gap-4 border-bottom pb-4">
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fw-bold mb-0">Program</h6>
                  {userIsEditor() && (
                    <Button
                      size="sm"
                      disabled={isLoading || addProgramStepDisabled()}
                      onClick={handleAddProgramStep}
                      variant="primary"
                      className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2">
                      <FaPlus />
                      <span>Add Step</span>
                    </Button>
                  )}
                </div>
                {programSteps.map((programStep, index) => (
                  <EventProgramStep
                    key={programStep.id}
                    id={programStep.id}
                    index={index}
                    setProgramSteps={setProgramSteps}
                    programSteps={programSteps}
                  />
                ))}
              </div>
            )}

            <div className="d-flex flex-column gap-4 pb-4">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="fw-bold mb-0">Guests</h6>
                {userIsEditor() && (
                  <Button
                    size="sm"
                    disabled={isLoading || addGuestDisabled()}
                    onClick={handleAddGuest}
                    variant="primary"
                    className="fw-bold border-2 py-1 px-2 d-flex align-items-center justify-content-center gap-2">
                    <FaPlus />
                    <span>Add Guest</span>
                  </Button>
                )}
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
          {userIsEditor() && (
            <Button
              variant="primary"
              disabled={isLoading || saveButtonDisabled()}
              className="d-flex align-items-center gap-2"
              onClick={handleEditEvent}>
              {isLoading && (
                <Spinner animation="border" variant="light" size="sm" />
              )}
              <span>Save</span>
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
