import { useEffect } from "react";
import { Container, Alert } from "react-bootstrap";
import { useGlobalStore } from "../../store/global";
import { useUserStore } from "../../store/user";
import { RiInformation2Fill } from "react-icons/ri";
import ErrorToast from "../../components/ErrorToast";
import { useMembersStore } from "../../store/dashboard/members";
import MembersTable from "../../components/dashboard/members/MembersTable";
import AddMemberModal from "../../components/dashboard/members/AddMemberModal";
import EditMemberModal from "../../components/dashboard/members/EditMemberModal";
import MembersTableHeader from "../../components/dashboard/members/MembersTableHeader";

export default function DashboardMembersPage() {
  const { setError, setSuccess } = useGlobalStore();
  const { getMembers, member, members, setLoadingStates } = useMembersStore();
  const { user } = useUserStore();

  useEffect(() => {
    getMembers();
    return () => {
      setLoadingStates({});
      setSuccess("");
      setError("");
    };
  }, [getMembers]);

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  const displayInfo = () => {
    return userIsEditor() && members && members.length >= 120;
  };

  return (
    <>
      <ErrorToast />
      <AddMemberModal />
      {member && <EditMemberModal />}

      <Container fluid className="py-5 px-0 max-w-5xl">
        <h2 className="mb-2 ms-4 me-5 fw-bold">Members</h2>
        <p className="ms-4 me-5 mb-5 text-body-secondary">
          View and manage club members.
        </p>
        {displayInfo() && (
          <Alert
            className="d-flex align-items-center gap-1 mx-4"
            key="info"
            variant="info">
            <RiInformation2Fill className="flex-shrink-0" size={24} />
            <span>
              You can't add more than <b>120 members</b>.
            </span>
          </Alert>
        )}
        <MembersTableHeader />
        <MembersTable />
      </Container>
    </>
  );
}
