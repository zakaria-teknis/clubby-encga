import { Button, Badge, Image } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { BsTrash3Fill, BsFillEyeFill } from "react-icons/bs";
import { useMembersStore } from "../../../store/dashboard/members";
import { useUserStore } from "../../../store/user";
import defaultProfileImage from "../../../assets/images/default-profile-image.png";

export default function MembersTableRow({
  memberId,
  firstName,
  lastName,
  email,
  phone,
  paidMembershipFee,
  createdAt,
  profileImage,
}) {
  const { setMember, deleteMember, setShowEditMemberModal, members } =
    useMembersStore();
  const { user } = useUserStore();

  const formatDateDDMMYYYY = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Africa/Casablanca",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  };

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber
      .toString()
      .replace(/\D+/g, "")
      .replace(/^/, "0")
      .replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3-$4-$5");
  };

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  const handleEdit = () => {
    setMember(members.find((member) => member._id === memberId));
    setShowEditMemberModal(true);
  };

  const handleDelete = () => {
    deleteMember(memberId);
  };

  return (
    <tr>
      <td className="ps-4 d-flex gap-3 align-items-center">
        <Image
          src={profileImage ? profileImage : defaultProfileImage}
          roundedCircle
          fluid
          className="w-6xs h-6xs align-self-center"
        />
        <div className="d-flex flex-column">
          <span className="d-block fw-semibold">
            {firstName} {lastName}
          </span>
          {email && <small className="text-muted d-block">{email}</small>}
          {phone && (
            <small className="text-muted d-block">
              {formatPhoneNumber(phone)}
            </small>
          )}
        </div>
      </td>
      <td className="align-middle">
        {!paidMembershipFee ? (
          <Badge bg="warning" className="text-dark">
            Undefined
          </Badge>
        ) : paidMembershipFee === "paid" ? (
          <Badge bg="success">Paid</Badge>
        ) : (
          <Badge bg="danger">Not Paid</Badge>
        )}
      </td>
      <td className="align-middle">
        <span className="d-block fw-semibold">
          {formatDateDDMMYYYY(createdAt)}
        </span>
      </td>
      <td className="align-middle">
        <div className="d-flex gap-2">
          <Button
            onClick={handleEdit}
            size="sm"
            variant="primary"
            className="d-flex align-items-center justify-content-center gap-1">
            {userIsEditor() ? (
              <>
                <FaUserEdit />
                <span>Edit</span>
              </>
            ) : (
              <>
                <BsFillEyeFill />
                <span>View</span>
              </>
            )}
          </Button>
          {userIsEditor() && (
            <Button
              onClick={handleDelete}
              size="sm"
              variant="outline-danger"
              className="d-flex align-items-center justify-content-center gap-1">
              <BsTrash3Fill />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
