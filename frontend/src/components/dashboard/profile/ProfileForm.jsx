import { useState, useEffect } from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import {
  FaSquareInstagram,
  FaSquareFacebook,
  FaLinkedin,
} from "react-icons/fa6";
import { useUserStore } from "../../../store/user";
import { useProfileStore } from "../../../store/dashboard/profile";

export default function ProfileForm() {
  const { user } = useUserStore();
  const { updateProfileInfo, validationErrors, setValidationErrors } =
    useProfileStore();
  const isLoading = useProfileStore(
    (state) => state.loadingStates["ProfileForm"]
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [club, setClub] = useState("");
  const [boardPosition, setBoardPosition] = useState("");
  const [description, setDescription] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [facebook, setFacebook] = useState("");

  useEffect(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setPhone(user.phone);
    setClub(user.club);
    setBoardPosition(user.board_position);
    setDescription(user.description);
    setInstagram(user.instagram);
    setLinkedin(user.linkedin);
    setFacebook(user.facebook);

    if (user.phone === null) setPhone("");

    return () => setValidationErrors([]);
  }, [user]);

  const removeExtraWhitespace = (string) => {
    return string
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, (char) => char.toUpperCase());
  };

  const formatString = (string) => {
    return string
      .replace(/\s+/g, " ")
      .trim()
      .split(/[-\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const validationErrorElement = (element) => {
    return (
      validationErrors &&
      validationErrors.some((error) => error.element.includes(element))
    );
  };

  const validationErrorMessage = (element) => {
    const error =
      validationErrors &&
      validationErrors.find((error) => error.element.includes(element));
    return error.message;
  };

  const saveButtonDisabled = () => {
    return (
      formatString(firstName) === user.first_name &&
      formatString(lastName) === user.last_name &&
      email === user.email &&
      phone === (user.phone || "") &&
      removeExtraWhitespace(description) === user.description &&
      instagram === user.instagram &&
      linkedin === user.linkedin &&
      facebook === user.facebook
    );
  };

  const handleSave = () => {
    updateProfileInfo(
      formatString(firstName),
      formatString(lastName),
      email,
      phone,
      removeExtraWhitespace(description),
      instagram,
      linkedin,
      facebook
    );
  };

  return (
    <Form>
      <div className="d-flex flex-column flex-sm-row gap-4 mb-4">
        <div className="d-flex gap-3 flex-column w-sm-50 w-100">
          <Form.Group>
            <Form.Label className="fw-semibold">First Name</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              maxLength={35}
              disabled={isLoading}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              placeholder="Enter your first name"
              isInvalid={validationErrorElement("first_name")}
            />
            {validationErrorElement("first_name") && (
              <Form.Text className="text-danger">
                {validationErrorMessage("first_name")}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label className="fw-semibold">Last Name</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              maxLength={35}
              disabled={isLoading}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              placeholder="Enter your last name"
              isInvalid={validationErrorElement("last_name")}
            />
            {validationErrorElement("last_name") && (
              <Form.Text className="text-danger">
                {validationErrorMessage("last_name")}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              maxLength={254}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter your email"
              isInvalid={validationErrorElement("email")}
            />
            {validationErrorElement("email") && (
              <Form.Text className="text-danger">
                {validationErrorMessage("email")}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label className="fw-semibold">Phone</Form.Label>
            <InputGroup>
              <InputGroup.Text>+212</InputGroup.Text>
              <Form.Control
                type="tel"
                maxLength={9}
                value={phone}
                disabled={isLoading}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                placeholder="(6 or 7) XX XX XX XX"
                isInvalid={validationErrorElement("phone")}
              />
            </InputGroup>
            {validationErrorElement("phone") && (
              <Form.Text className="text-danger">
                {validationErrorMessage("phone")}
              </Form.Text>
            )}
          </Form.Group>
        </div>
        <div className="d-flex gap-3 w-sm-50 w-100 flex-column">
          <Form.Group>
            <Form.Label className="fw-semibold">Club</Form.Label>
            <Form.Control
              type="text"
              value={formatString(club)}
              plaintext
              readOnly
              placeholder=""
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="fw-semibold">Position</Form.Label>
            <Form.Control
              type="text"
              value={formatString(boardPosition)}
              plaintext
              readOnly
              placeholder=""
            />
          </Form.Group>
          <Form.Group className="flex-grow-1 d-flex flex-column">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              className="flex-grow-1"
              as="textarea"
              placeholder="Something cool about yourself..."
              value={description}
              maxLength={200}
              disabled={isLoading}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Form.Group>
        </div>
      </div>

      <div className="mb-3 d-flex flex-column flex-sm-row gap-4">
        <Form.Group className="flex-grow-1">
          <Form.Label className="d-flex align-items-center gap-1 fw-semibold">
            <FaSquareInstagram />
            <span>Instagram</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={instagram}
            maxLength={60}
            disabled={isLoading}
            onChange={(e) => {
              setInstagram(e.target.value);
            }}
            placeholder="https://www.instagram.com/johndoe/"
            isInvalid={validationErrorElement("instagram")}
          />
          {validationErrorElement("instagram") && (
            <Form.Text className="text-danger">
              {validationErrorMessage("instagram")}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="flex-grow-1">
          <Form.Label className="d-flex align-items-center gap-1 fw-semibold">
            <FaLinkedin />
            <span>LinkedIn</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={linkedin}
            maxLength={130}
            disabled={isLoading}
            onChange={(e) => {
              setLinkedin(e.target.value);
            }}
            placeholder="https://www.linkedin.com/in/john-doe/"
            isInvalid={validationErrorElement("linkedin")}
          />
          {validationErrorElement("linkedin") && (
            <Form.Text className="text-danger">
              {validationErrorMessage("linkedin")}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="flex-grow-1">
          <Form.Label className="d-flex align-items-center gap-1 fw-semibold">
            <FaSquareFacebook />
            <span>Facebook</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={facebook}
            maxLength={80}
            disabled={isLoading}
            onChange={(e) => {
              setFacebook(e.target.value);
            }}
            placeholder="https://www.facebook.com/profile.php?id=01234567890123"
            isInvalid={validationErrorElement("facebook")}
          />
          {validationErrorElement("facebook") && (
            <Form.Text className="text-danger">
              {validationErrorMessage("facebook")}
            </Form.Text>
          )}
        </Form.Group>
      </div>

      <Button
        disabled={isLoading || saveButtonDisabled()}
        onClick={handleSave}
        className="fw-semibold d-flex border-2 py-2 px-4 gap-2 align-items-center">
        {isLoading && <Spinner animation="border" variant="light" size="sm" />}
        <span>Save</span>
      </Button>
    </Form>
  );
}
