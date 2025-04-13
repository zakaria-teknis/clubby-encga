import { Image } from "react-bootstrap";
import defaultProfileImage from "../../assets/images/default-profile-image.png";
import { useClubsStore } from "../../store/public/clubs";

export default function ClubPageBoardCard({
  id,
  firstName,
  lastName,
  boardPosition,
  profileImage,
}) {
  const { setBoardMember, boardMembers, setShowBoardMemberDetails } =
    useClubsStore();

  const formatString = (string) => {
    return string
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleShowDetails = () => {
    setBoardMember(boardMembers.find((member) => member._id === id));
    setShowBoardMemberDetails(true);
  };

  return (
    <div
      className="d-flex flex-column w-4xs align-items-center justify-content-center mb-4"
      onClick={handleShowDetails}
      style={{ cursor: "pointer" }}>
      <div>
        <Image
          src={profileImage ? profileImage : defaultProfileImage}
          className="border w-5xs h-5xs border-primary-subtle mb-3"
          roundedCircle
        />
      </div>
      <h5 className="mb-1 text-center">
        {firstName} {lastName}
      </h5>
      <span className="text-secondary text-center">
        {formatString(boardPosition)}
      </span>
    </div>
  );
}
