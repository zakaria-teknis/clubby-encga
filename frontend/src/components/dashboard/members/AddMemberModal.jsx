import { useState, useRef} from "react";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  Image,
  Spinner,
} from "react-bootstrap";
import { useMembersStore } from "../../../store/dashboard/members";
import { BsImageFill, BsTrash3Fill } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import defaultProfileImage from "../../../assets/images/default-profile-image.png";
import SuccessToast from "../../SuccessToast";

export default function AddMemberModal() {
  const {
    showAddMemberModal,
    setShowAddMemberModal,
    addMember,
    validationErrors,
    setValidationErrors,
  } = useMembersStore();
  const isLoading = useMembersStore(
    (state) => state.loadingStates["AddMemberModal"]
  );

  const profileImageRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paidMembershipFee, setPaidMembershipFee] = useState("");
  const [profileImage, setProfileImage] = useState(null);

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

  const HandleCloseModal = () => {
    setShowAddMemberModal(false);
    setValidationErrors([]);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setProfileImage(null);
  };

  const handleSuccessToastEnter = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setProfileImage(null);
  };

  const handleAddMember = () => {
    addMember(
      formatString(firstName),
      formatString(lastName),
      email,
      phone,
      paidMembershipFee,
      profileImage
    );
  };

  return (
    <>
      <SuccessToast handleSuccessToastEnter={handleSuccessToastEnter} />
      <Modal size="lg" show={showAddMemberModal}>
        <Modal.Header className="d-flex justify-content-between">
          <Modal.Title>Add member</Modal.Title>
          <Button
            variant="light"
            disabled={isLoading}
            className="rounded-circle d-flex align-items-center p-1"
            onClick={HandleCloseModal}>
            <FaXmark size={20} />
          </Button>
        </Modal.Header>
        <Modal.Body
          className="d-flex flex-column gap-4 overflow-auto"
          style={{ maxHeight: "70vh" }}>
          <div className="d-flex flex-column flex-sm-row align-items-center gap-sm-4">
            <Image
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : defaultProfileImage
              }
              roundedCircle
              fluid
              className="w-4xs h-4xs mb-3 align-self-center"
            />
            <div
              className="d-flex gap-2 flex-column justify-content-start justify-content-sm-around"
              style={{ width: "fit-content" }}>
              <Button
                size="sm"
                variant="outline-primary"
                disabled={isLoading}
                className="fw-bold border-2 py-1 px-2 d-flex align-items-center gap-2 position-relative">
                <BsImageFill />
                <span>Change</span>
                <Form.Control
                  type="file"
                  accept="image/*"
                  name="profileImage"
                  ref={profileImageRef}
                  onChange={(e) =>
                    handleChangeImage(
                      e,
                      setProfileImage,
                      profileImage,
                      profileImageRef
                    )
                  }
                  className="position-absolute opacity-0 w-100 h-100 top-0 start-0"
                />
              </Button>
              <Button
                size="sm"
                variant="outline-primary"
                disabled={!profileImage || isLoading}
                onClick={() => setProfileImage(null)}
                className="fw-bold border-2 py-1 px-2 d-flex align-items-center gap-2">
                <BsTrash3Fill />
                <span>Remove</span>
              </Button>
            </div>
          </div>

          <Form className="border-top pt-4 pb-3 d-flex flex-column gap-3">
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Form.Group className="w-100 w-sm-50">
                <Form.Label className="fw-bold">First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  maxLength={35}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  placeholder="John"
                  isInvalid={validationErrorElement("first_name")}
                />
                {validationErrorElement("first_name") && (
                  <Form.Text className="text-danger">
                    {validationErrorMessage("first_name")}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="w-100 w-sm-50">
                <Form.Label className="fw-bold">Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={lastName}
                  maxLength={35}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  disabled={isLoading}
                  placeholder="Doe"
                  isInvalid={validationErrorElement("last_name")}
                />
                {validationErrorElement("last_name") && (
                  <Form.Text className="text-danger">
                    {validationErrorMessage("last_name")}
                  </Form.Text>
                )}
              </Form.Group>
            </div>
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Form.Group className="w-100 w-sm-50">
                <Form.Label className="fw-bold">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  maxLength={254}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  disabled={isLoading}
                  placeholder="johndoe@gmail.com"
                  isInvalid={validationErrorElement("email")}
                />
                {validationErrorElement("email") && (
                  <Form.Text className="text-danger">
                    {validationErrorMessage("email")}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="w-100 w-sm-50">
                <Form.Label className="fw-bold">Phone</Form.Label>
                <InputGroup>
                  <InputGroup.Text>+212</InputGroup.Text>
                  <Form.Control
                    type="tel"
                    maxLength={9}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    disabled={isLoading}
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

            <Form.Group className="w-100">
              <Form.Label className="fw-bold">Membership Fee</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Paid"
                  disabled={isLoading}
                  name="paidMembershipFee"
                  type="radio"
                  id="inline-radio-paid"
                  checked={paidMembershipFee === "paid"}
                  onChange={() => setPaidMembershipFee("paid")}
                />
                <Form.Check
                  inline
                  label="Not paid"
                  disabled={isLoading}
                  name="paidMembershipFee"
                  type="radio"
                  id="inline-radio-unpaid"
                  checked={paidMembershipFee === "unpaid"}
                  onChange={() => setPaidMembershipFee("unpaid")}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            disabled={isLoading}
            onClick={HandleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            className="d-flex align-items-center gap-2"
            disabled={isLoading}
            onClick={handleAddMember}>
            {isLoading && (
              <Spinner animation="border" variant="light" size="sm" />
            )}
            <span>Add member</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
