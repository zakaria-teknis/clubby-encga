import { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  Image,
  Spinner,
} from "react-bootstrap";
import { useMembersStore } from "../../../store/dashboard/members";
import { useUserStore } from "../../../store/user";
import { BsImageFill, BsTrash3Fill } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import defaultProfileImage from "../../../assets/images/default-profile-image.png";
import SuccessToast from "../../SuccessToast";

export default function EditMemberModal() {
  const {
    showEditMemberModal,
    setShowEditMemberModal,
    member,
    validationErrors,
    setValidationErrors,
    setMember,
    updateMember,
  } = useMembersStore();
  const { user } = useUserStore();
  const isLoading = useMembersStore(
    (state) => state.loadingStates["EditMemberModal"]
  );

  const profileImageRef = useRef(null);

  const [firstName, setFirstName] = useState(member.first_name);
  const [lastName, setLastName] = useState(member.last_name);
  const [email, setEmail] = useState(member.email);
  const [phone, setPhone] = useState("");
  const [paidMembershipFee, setPaidMembershipFee] = useState(
    member.paid_membership_fee
  );
  const [profileImage, setProfileImage] = useState(member.profile_image_url);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    if (member.phone === null) {
      setPhone("");
    } else setPhone(member.phone);

    return setRemoveImage(false);
  }, [member]);

  const formatString = (string) => {
    return string
      .replace(/\s+/g, " ")
      .trim()
      .split(/[-\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  const saveButtonDisabled = () => {
    return (
      formatString(firstName) === member.first_name &&
      formatString(lastName) === member.last_name &&
      email === member.email &&
      phone === (member.phone || "") &&
      paidMembershipFee === member.paid_membership_fee &&
      profileImage === member.profile_image_url
    );
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
      setRemoveImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const HandleCloseModal = () => {
    setShowEditMemberModal(false);
    setValidationErrors([]);
    setMember(null);
  };

  const handleRemoveImage = () => {
    setProfileImage("");
    setRemoveImage(true);
  };

  const handleEditMember = () => {
    updateMember(
      formatString(firstName),
      formatString(lastName),
      email,
      phone,
      paidMembershipFee,
      profileImage,
      removeImage
    );
  };

  return (
    <>
      <SuccessToast />
      <Modal size="lg" show={showEditMemberModal}>
        <Modal.Header className="d-flex justify-content-between">
          <Modal.Title>
            {userIsEditor() ? (
              <span>Edit member</span>
            ) : (
              <span>View member</span>
            )}
          </Modal.Title>
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
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-sm-4">
            <Image
              src={
                !profileImage
                  ? defaultProfileImage
                  : typeof profileImage === "string"
                  ? profileImage
                  : URL.createObjectURL(profileImage)
              }
              roundedCircle
              fluid
              className="w-4xs h-4xs mb-3 align-self-center"
            />
            {userIsEditor() && (
              <div
                className="d-flex gap-2 flex-column justify-content-start justify-content-sm-around"
                style={{ width: "fit-content" }}>
                <Button
                  variant="outline-primary"
                  disabled={isLoading}
                  className="fw-bold border-2 py-1 px-2 d-flex align-items-center gap-2 position-relative">
                  <BsImageFill />
                  <small>Change</small>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="profile-image"
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
                  onClick={handleRemoveImage}
                  className="fw-bold border-2 py-1 px-2 d-flex align-items-center gap-2">
                  <BsTrash3Fill />
                  <span>Remove</span>
                </Button>
              </div>
            )}
          </div>

          <Form className="border-top pt-4 pb-3 d-flex flex-column gap-3">
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Form.Group className="w-100 w-sm-50">
                <Form.Label className="fw-bold">First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  plaintext={!userIsEditor()}
                  readOnly={!userIsEditor()}
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
                  plaintext={!userIsEditor()}
                  readOnly={!userIsEditor()}
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
                  plaintext={!userIsEditor()}
                  readOnly={!userIsEditor()}
                  maxLength={254}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  disabled={isLoading}
                  placeholder={
                    !userIsEditor() && !email
                      ? "No email provided"
                      : "johndoe@gmail.com"
                  }
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
                  {userIsEditor() && <InputGroup.Text>+212</InputGroup.Text>}
                  <Form.Control
                    type="tel"
                    maxLength={9}
                    value={
                      phone && !userIsEditor()
                        ? formatPhoneNumber(phone)
                        : phone
                    }
                    plaintext={!userIsEditor()}
                    readOnly={!userIsEditor()}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    disabled={isLoading}
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

            <Form.Group className="w-100 w-sm-50">
              <Form.Label className="fw-bold">Membership Fee</Form.Label>
              {userIsEditor() ? (
                <div>
                  <Form.Check
                    inline
                    label="Paid"
                    name="paidMembershipFee"
                    type="radio"
                    id="inline-radio-paid"
                    checked={paidMembershipFee === "paid"}
                    onChange={() => setPaidMembershipFee("paid")}
                  />
                  <Form.Check
                    inline
                    label="Not paid"
                    name="paidMembershipFee"
                    type="radio"
                    id="inline-radio-unpaid"
                    checked={paidMembershipFee === "unpaid"}
                    onChange={() => setPaidMembershipFee("unpaid")}
                  />
                </div>
              ) : (
                <Form.Control
                  type="text"
                  value={formatString(paidMembershipFee)}
                  plaintext
                  readOnly
                  placeholder={
                    !userIsEditor() && !phone ? "Not provided" : "Phone"
                  }
                />
              )}
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
          {userIsEditor() && (
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
              disabled={isLoading || saveButtonDisabled()}
              onClick={handleEditMember}>
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
