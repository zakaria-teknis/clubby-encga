import { useState, useEffect } from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import {
  FaSquareInstagram,
  FaSquareFacebook,
  FaLinkedin,
} from "react-icons/fa6";
import { useClubStore } from "../../../store/dashboard/club";
import { useUserStore } from "../../../store/user";

export default function ClubForm() {
  const { validationErrors, setValidationErrors, club, updateClubInfo } =
    useClubStore();
  const { user } = useUserStore();
  const isLoading = useClubStore((state) => state.loadingStates["ClubForm"]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [facebook, setFacebook] = useState("");

  useEffect(() => {
    setName(club.name);
    setEmail(club.email);
    setPhone(club.phone);
    setDescription(club.description);
    setWebsite(club.website);
    setInstagram(club.instagram);
    setLinkedin(club.linkedin);
    setFacebook(club.facebook);

    if (club.phone === null) setPhone("");

    return () => setValidationErrors([]);
  }, [club]);

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

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber
      .toString()
      .replace(/\D+/g, "")
      .replace(/^/, "0")
      .replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3-$4-$5");
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
      email === club.email &&
      phone === (club.phone || "") &&
      removeExtraWhitespace(description) === club.description &&
      website === club.website &&
      instagram === club.instagram &&
      linkedin === club.linkedin &&
      facebook === club.facebook
    );
  };

  const handleSave = () => {
    updateClubInfo(
      email,
      phone,
      removeExtraWhitespace(description),
      website,
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
            <Form.Label className="fw-semibold">Name</Form.Label>
            <Form.Control
              type="text"
              value={formatString(name)}
              plaintext
              readOnly
              placeholder="Name"
              isInvalid={validationErrorElement("name")}
            />
            {validationErrorElement("name") && (
              <Form.Text className="text-danger">
                {validationErrorMessage("name")}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              plaintext={!userIsEditor()}
              readOnly={!userIsEditor()}
              disabled={isLoading}
              maxLength={254}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder={
                !userIsEditor() && !email
                  ? "No email provided"
                  : "yourclub@gmail.com"
              }
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
              {userIsEditor() && <InputGroup.Text>+212</InputGroup.Text>}
              <Form.Control
                type="tel"
                maxLength={9}
                value={
                  phone && !userIsEditor() ? formatPhoneNumber(phone) : phone
                }
                plaintext={!userIsEditor()}
                readOnly={!userIsEditor()}
                disabled={isLoading}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                placeholder={
                  !userIsEditor() && !phone
                    ? "No phone number provided"
                    : "(6 or 7) XX XX XX XX"
                }
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
            <Form.Label className="fw-semibold">Website</Form.Label>
            <Form.Control
              type="text"
              value={website}
              plaintext={!userIsEditor()}
              readOnly={!userIsEditor()}
              disabled={isLoading}
              maxLength={255}
              onChange={(e) => {
                setWebsite(e.target.value);
              }}
              placeholder={
                !userIsEditor() && !website
                  ? "No website provided"
                  : "www.yourclub.com"
              }
              isInvalid={validationErrorElement("website")}
            />
            {validationErrorElement("website") && (
              <Form.Text className="text-danger">
                {validationErrorMessage("website")}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="flex-grow-1 d-flex flex-column">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              className="flex-grow-1"
              as="textarea"
              placeholder={
                !userIsEditor() && !description
                  ? "No description provided"
                  : "Something cool about your club..."
              }
              value={description}
              plaintext={!userIsEditor()}
              readOnly={!userIsEditor()}
              disabled={isLoading}
              maxLength={500}
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
            plaintext={!userIsEditor()}
            readOnly={!userIsEditor()}
            disabled={isLoading}
            maxLength={60}
            onChange={(e) => {
              setInstagram(e.target.value);
            }}
            placeholder={
              !userIsEditor() && !instagram
                ? "No link provided"
                : "https://www.instagram.com/yourclub/"
            }
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
            plaintext={!userIsEditor()}
            readOnly={!userIsEditor()}
            disabled={isLoading}
            maxLength={130}
            onChange={(e) => {
              setLinkedin(e.target.value);
            }}
            placeholder={
              !userIsEditor() && !linkedin
                ? "No link provided"
                : "https://www.linkedin.com/in/your-club/"
            }
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
            plaintext={!userIsEditor()}
            readOnly={!userIsEditor()}
            disabled={isLoading}
            maxLength={80}
            onChange={(e) => {
              setFacebook(e.target.value);
            }}
            placeholder={
              !userIsEditor() && !facebook
                ? "No link provided"
                : "https://www.facebook.com/profile.php?id=01234567890123"
            }
            isInvalid={validationErrorElement("facebook")}
          />
          {validationErrorElement("facebook") && (
            <Form.Text className="text-danger">
              {validationErrorMessage("facebook")}
            </Form.Text>
          )}
        </Form.Group>
      </div>

      {userIsEditor() && (
        <Button
          variant="primary"
          disabled={isLoading || saveButtonDisabled()}
          onClick={handleSave}
          className="fw-semibold d-flex border-2 py-2 px-4 gap-2 align-items-center">
          {isLoading && (
            <Spinner animation="border" variant="light" size="sm" />
          )}
          <span>Save</span>
        </Button>
      )}
    </Form>
  );
}
