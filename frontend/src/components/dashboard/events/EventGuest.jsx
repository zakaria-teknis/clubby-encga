import { useRef, useEffect } from "react";
import { Form, Button, Image } from "react-bootstrap";
import { FaXmark } from "react-icons/fa6";
import { BsImageFill, BsTrash3Fill } from "react-icons/bs";
import { useEventsStore } from "../../../store/dashboard/events";
import { useUserStore } from "../../../store/user";
import defaultProfileImage from "../../../assets/images/default-profile-image.png";

export default function EventGuest({ id, index, setGuests, guests }) {
  const { validationErrors } = useEventsStore();
  const { user } = useUserStore();
  const createEventModalisLoading = useEventsStore(
    (state) => state.loadingStates["CreateEventModal"]
  );
  const editEventModalisLoading = useEventsStore(
    (state) => state.loadingStates["EditEventModal"]
  );

  const guest = guests.find((guest) => guest.id === id);

  useEffect(() => {
    return () => {
      if (guest.guestImage) {
        URL.revokeObjectURL(guest.guestImage);
      }
    };
  }, [guest.guestImage]);

  const guestImageRef = useRef(null);

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

  const handleChangeImage = (event, fileInputRef) => {
    const file = event.target.files[0];
    if (file) {
      const currentImage = guests.some(
        (guest) => guest.id === id && guest.profileImage
      );

      if (currentImage) {
        URL.revokeObjectURL(currentImage);
      }

      setGuests((prevGuests) =>
        prevGuests.map((guest) =>
          guest.id === id
            ? { ...guest, guestImage: file, removeGuestImage: false }
            : guest
        )
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setGuests((prevGuests) =>
      prevGuests.map((guest) =>
        guest.id === id
          ? { ...guest, guestImage: "", removeGuestImage: true }
          : guest
      )
    );
  };

  const handleDeleteGuest = () => {
    setGuests((prevGuests) => prevGuests.filter((guest) => guest.id !== id));
  };

  const updateGuestProperty = (property, value) => {
    setGuests((prevGuests) =>
      prevGuests.map((guest) =>
        guest.id === id ? { ...guest, [property]: value } : guest
      )
    );
  };

  return (
    <div className="d-flex flex-column rounded p-3 shadow gap-4">
      <div className="border-bottom pb-3 d-flex justify-content-between">
        <h6 className="fw-bold">Guest {index + 1}</h6>
        {userIsEditor() && (
          <Button
            variant="light"
            disabled={createEventModalisLoading || editEventModalisLoading}
            onClick={handleDeleteGuest}
            className="rounded-circle d-flex align-items-center p-1">
            <FaXmark size={16} />
          </Button>
        )}
      </div>

      <div className="d-flex flex-column flex-sm-row align-items-center align-self-center gap-sm-4">
        <Image
          roundedCircle
          src={
            !guest.guestImage
              ? defaultProfileImage
              : typeof guest.guestImage === "string"
              ? guest.guestImage
              : URL.createObjectURL(guest.guestImage)
          }
          fluid
          className="w-4xs h-4xs mb-3 align-self-center"
        />
        {userIsEditor() && (
          <div
            className="d-flex gap-2 flex-column justify-content-start justify-content-sm-around"
            style={{ width: "fit-content" }}>
            <Button
              size="sm"
              disabled={createEventModalisLoading || editEventModalisLoading}
              variant="outline-primary"
              className="fw-bold border-2 py-1 px-2 d-flex align-items-center gap-2 position-relative">
              <BsImageFill />
              <span>Change</span>
              <Form.Control
                type="file"
                onChange={(e) => handleChangeImage(e, guestImageRef)}
                accept="image/*"
                name="guestImage"
                ref={guestImageRef}
                className="position-absolute opacity-0 w-100 h-100 top-0 start-0"
              />
            </Button>
            <Button
              size="sm"
              variant="outline-primary"
              disabled={
                !guest.guestImage ||
                createEventModalisLoading ||
                editEventModalisLoading
              }
              onClick={() => handleRemoveImage()}
              className="fw-bold border-2 py-1 px-2 d-flex align-items-center gap-2">
              <BsTrash3Fill />
              <span>Remove</span>
            </Button>
          </div>
        )}
      </div>

      <Form.Group className="flex-grow-1">
        <Form.Label className="fw-bold">Full Name</Form.Label>
        <Form.Control
          type="text"
          disabled={createEventModalisLoading || editEventModalisLoading}
          value={guest.fullName}
          plaintext={!userIsEditor()}
          readOnly={!userIsEditor()}
          onChange={(e) => updateGuestProperty("fullName", e.target.value)}
          placeholder="John Doe"
          maxLength={100}
          isInvalid={validationErrorElement("full_name", "guests")}
        />
        {validationErrorElement("full_name", "guests") && (
          <Form.Text className="text-danger">
            {validationErrorMessage("full_name", "guests")}
          </Form.Text>
        )}
      </Form.Group>

      <div className="d-flex flex-column flex-sm-row gap-3">
        <div className="d-flex flex-column flex-grow-1 gap-4">
          <Form.Group className="flex-grow-1">
            <Form.Label className="fw-bold">Instagram</Form.Label>
            <Form.Control
              type="text"
              disabled={createEventModalisLoading || editEventModalisLoading}
              value={guest.instagram}
              plaintext={!userIsEditor()}
              readOnly={!userIsEditor()}
              onChange={(e) => updateGuestProperty("instagram", e.target.value)}
              placeholder={
                !userIsEditor() && !guest.instagram
                  ? "No link provided"
                  : "https://www.instagram.com/johndoe/"
              }
              maxLength={60}
              isInvalid={validationErrorElement("instagram", "guests")}
            />
            {validationErrorElement("instagram", "guests") && (
              <Form.Text className="text-danger">
                {validationErrorMessage("instagram", "guests")}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="flex-grow-1">
            <Form.Label className="fw-bold">LinkedIn</Form.Label>
            <Form.Control
              type="text"
              disabled={createEventModalisLoading || editEventModalisLoading}
              value={guest.linkedin}
              plaintext={!userIsEditor()}
              readOnly={!userIsEditor()}
              onChange={(e) => updateGuestProperty("linkedin", e.target.value)}
              placeholder={
                !userIsEditor() && !guest.linkedin
                  ? "No link provided"
                  : "https://www.linkedin.com/in/john-doe/"
              }
              maxLength={130}
              isInvalid={validationErrorElement("linkedin", "guests")}
            />
            {validationErrorElement("linkedin", "guests") && (
              <Form.Text className="text-danger">
                {validationErrorMessage("linkedin", "guests")}
              </Form.Text>
            )}
          </Form.Group>
        </div>

        <Form.Group className="flex-grow-1 d-flex flex-column">
          <Form.Label className="fw-bold">Description</Form.Label>
          <Form.Control
            className="flex-grow-1"
            disabled={createEventModalisLoading || editEventModalisLoading}
            as="textarea"
            value={guest.description}
            plaintext={!userIsEditor()}
            readOnly={!userIsEditor()}
            onChange={(e) => updateGuestProperty("description", e.target.value)}
            placeholder="Industry Expert, Keynote Speaker..."
            maxLength={200}
            isInvalid={validationErrorElement("description", "guests")}
          />
          {validationErrorElement("description", "guests") && (
            <Form.Text className="text-danger">
              {validationErrorMessage("description", "guests")}
            </Form.Text>
          )}
        </Form.Group>
      </div>
    </div>
  );
}
