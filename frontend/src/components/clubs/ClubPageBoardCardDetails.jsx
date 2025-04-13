import { Modal, Button, Image } from "react-bootstrap";
import { useClubsStore } from "../../store/public/clubs";
import defaultProfileImage from "../../assets/images/default-profile-image.png";
import {
  FaSquareInstagram,
  FaSquareFacebook,
  FaLinkedin,
  FaXmark,
} from "react-icons/fa6";

export default function ClubPageBoardCardDetails() {
  const {
    boardMember,
    setBoardMember,
    showBoardMemberDetails,
    setShowBoardMemberDetails,
  } = useClubsStore();

  const handleCloseModal = () => {
    setBoardMember(null);
    setShowBoardMemberDetails(false);
  };

  const formatString = (string) => {
    return string
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber
      .toString()
      .replace(/\D+/g, "")
      .replace(/^/, "0")
      .replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3-$4-$5");
  };

  return (
    <Modal size="lg" show={showBoardMemberDetails} centered>
      <Modal.Header className="d-flex justify-content-between">
        <Modal.Title>Details</Modal.Title>
        <Button
          variant="light"
          className="rounded-circle d-flex align-items-center p-1"
          onClick={handleCloseModal}>
          <FaXmark size={20} />
        </Button>
      </Modal.Header>
      <Modal.Body
        className="d-flex flex-column gap-4 overflow-auto"
        style={{ maxHeight: "70vh" }}>
        <div className="d-flex gap-2 gap-sm-0 flex-column flex-lg-row align-items-center justify-content-lg-between">
          <div className="d-flex flex-column flex-sm-row align-items-center gap-sm-4">
            <Image
              src={
                boardMember.profile_image_url
                  ? boardMember.profile_image_url
                  : defaultProfileImage
              }
              roundedCircle
              fluid
              className="w-4xs h-4xs mb-3 align-self-center"
            />
            <div className="text-center text-sm-start">
              <h4>
                {boardMember.first_name} {boardMember.last_name}
              </h4>
              <h6 className="text-secondary">{boardMember.email}</h6>
            </div>
          </div>
          {(boardMember.instagram ||
            boardMember.linkedin ||
            boardMember.facebook) && (
            <div
              className="d-flex align-items-center gap-4"
              style={{ width: "fit-content" }}>
              {boardMember.instagram && (
                <a href={boardMember.instagram} className="text-body">
                  <FaSquareInstagram size={28} />
                </a>
              )}
              {boardMember.linkedin && (
                <a href={boardMember.linkedin} className="text-body">
                  <FaLinkedin size={28} />
                </a>
              )}
              {boardMember.facebook && (
                <a href={boardMember.facebook} className="text-body">
                  <FaSquareFacebook size={28} />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="d-flex flex-column border-top pt-4">
          <div className="d-flex flex-column flex-sm-row gap-sm-5">
            <div className="d-flex flex-column w-100 w-sm-50">
              <div>
                <h6 className="fw-bold">Name</h6>
                <p>
                  {boardMember.first_name} {boardMember.last_name}
                </p>
              </div>
              <div>
                <h6 className="fw-bold">Email</h6>
                <p>{boardMember.email}</p>
              </div>
              <div>
                <h6 className="fw-bold">Phone</h6>
                <p>{formatPhoneNumber(boardMember.phone)}</p>
              </div>
            </div>
            <div className="d-flex flex-column w-100 w-sm-50">
              <div>
                <h6 className="fw-bold">Club</h6>
                <p>{formatString(boardMember.club)}</p>
              </div>
              <div>
                <h6 className="fw-bold">Position</h6>
                <p>{formatString(boardMember.board_position)}</p>
              </div>
            </div>
          </div>
          {boardMember.description && (
            <div className="w-100">
              <h6 className="fw-bold">Description</h6>
              <p>{boardMember.description}</p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCloseModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
