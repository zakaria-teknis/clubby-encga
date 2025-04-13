import { Container } from "react-bootstrap";
import {
  FaSquareInstagram,
  FaSquareFacebook,
  FaLinkedin,
} from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useBoardStore } from "../../../store/dashboard/board";
import BoardCardDetails from "./BoardCardDetails";
import defaultProfileImage from "../../../assets/images/default-profile-image.png";

export default function BoardCard({
  boardMemberId,
  profileImage,
  firstName,
  lastName,
  boardPosition,
  description,
  instagram,
  linkedin,
  facebook,
}) {
  const { setShowDetails, setBoardMember, boardMembers } = useBoardStore();

  const formatString = (string) => {
    return string
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleShowDetails = () => {
    setBoardMember(
      boardMembers.find((boardMember) => boardMember._id === boardMemberId)
    );
    setShowDetails(true);
  };

  return (
    <Container className="p-0 d-flex max-w-sm flex-shrink-0 gap-3 h-3xs">
      <div
        className={`rounded overflow-hidden d-flex w-50 ${
          !profileImage && "justify-content-center align-items-center"
        }`}
        style={{ width: "50%" }}>
        <img src={profileImage ? profileImage : defaultProfileImage} />
      </div>
      <div className="d-flex flex-column py-2 h-100 w-50">
        <h5>
          {firstName} {lastName}
        </h5>
        <h6>{formatString(boardPosition)}</h6>
        {description && (
          <p
            className="text-ellipsis overflow-hidden flex-grow-1"
            style={{
              WebkitLineClamp: "3",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              textOverflow: "elipsis",
            }}>
            {description}
          </p>
        )}
        <div className="d-flex align-items-center gap-3 mt-auto">
          {instagram && (
            <a href={instagram} className="text-body">
              <FaSquareInstagram size={24} />
            </a>
          )}
          {linkedin && (
            <a href={linkedin} className="text-body">
              <FaLinkedin size={24} />
            </a>
          )}
          {facebook && (
            <a href={facebook} className="text-body">
              <FaSquareFacebook size={24} />
            </a>
          )}
          <BsThreeDotsVertical
            className="ms-auto"
            role="button"
            size={20}
            onClick={handleShowDetails}
          />
        </div>
      </div>
    </Container>
  );
}
