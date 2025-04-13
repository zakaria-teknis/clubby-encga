import { Button, Badge } from "react-bootstrap";
import { useRequestStore } from "../../../store/dashboard/request";

export default function RequestsTableRow({
  id,
  firstName,
  lastName,
  club,
  boardPosition,
  role,
  phone,
  email,
  createdAt,
  status,
}) {
  const { approveRequest, rejectRequest } = useRequestStore();

  const formatDateDDMMYYYY = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return `${formattedDate}`;
  };

  const formatString = (string) => {
    return string
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatClub = (club) => {
    let formattedClub = club;

    if (club === "jlm") formattedClub = "Jeunes Leaders Marocains";
    if (club === "cop") formattedClub = "Club d'Orientation Pédagogique";
    if (club === "cdi") formattedClub = "Club du Digital et de l'Innovation";
    if (club === "rcc") formattedClub = "Readers' Corner Club";
    if (club === "sport-for-dev") formattedClub = "Sport For Development";
    if (club === "is-club") formattedClub = "International Student Club";
    if (club === "jtc") formattedClub = "Junior Traders Club";

    return formattedClub
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

  const handleApprove = () => {
    approveRequest(firstName, lastName, club, boardPosition, email, id);
  };

  const handleReject = () => {
    rejectRequest(firstName, lastName, club, boardPosition, email, id);
  };

  return (
    <tr>
      <td className="align-middle ps-4">
        <span className="d-block fw-semibold">
          {firstName} {lastName}
        </span>
        <small className="text-muted d-block">{email}</small>
        <small className="text-muted d-block">{formatPhoneNumber(phone)}</small>
      </td>
      <td className="align-middle">
        <span className="d-block fw-semibold">{formatClub(club)}</span>
        <small className="text-muted d-block">
          {formatString(boardPosition)}
        </small>
      </td>
      <td className="align-middle">
        {role.includes("editor") ? (
          <Badge bg="dark">Editor</Badge>
        ) : (
          <Badge bg="primary">Board Member</Badge>
        )}
      </td>
      <td className="align-middle">
        <span className="d-block fw-semibold">
          {formatDateDDMMYYYY(createdAt)}
        </span>
      </td>
      <td className="align-middle">
        {status === "pending" ? (
          <div className="d-flex gap-2">
            <Button variant="success" size="sm" onClick={handleApprove}>
              Approve
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleReject}>
              Reject
            </Button>
          </div>
        ) : (
          <Badge bg="success">Approved</Badge>
        )}
      </td>
    </tr>
  );
}
