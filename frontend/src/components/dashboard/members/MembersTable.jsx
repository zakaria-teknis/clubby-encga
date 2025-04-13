import { Table, Spinner } from "react-bootstrap";
import { useMembersStore } from "../../../store/dashboard/members";
import { BsPeopleFill } from "react-icons/bs";
import MembersTableRow from "./MembersTableRow";
import { useUserStore } from "../../../store/user";

export default function MembersTable() {
  const { orderedMembers, setShowAddMemberModal } = useMembersStore();
  const { user } = useUserStore();
  const isLoading = useMembersStore(
    (state) => state.loadingStates["MembersTable"]
  );

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  return (
    <Table responsive className="w-100 min-w-3xl">
      <thead>
        <tr className="border-top">
          <th className="ps-4">Member</th>
          <th>Membership Fee</th>
          <th>Date added</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan="5" className="text-center py-5 text-body-tertiary">
              <Spinner animation="border" />;
            </td>
          </tr>
        ) : orderedMembers && orderedMembers.length > 0 ? (
          orderedMembers.map((member) => (
            <MembersTableRow
              key={member._id}
              memberId={member._id}
              firstName={member.first_name}
              lastName={member.last_name}
              email={member.email}
              paidMembershipFee={member.paid_membership_fee}
              phone={member.phone}
              createdAt={member.createdAt}
              updatedAt={member.updatedAt}
              profileImage={member.profile_image_url}
            />
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-5 text-body-tertiary">
              <BsPeopleFill size={56} className="mb-2" />
              {userIsEditor() ? (
                <h6 className="mb-0">It's lonely in here...</h6>
              ) : (
                <h6 className="mb-0">No members found</h6>
              )}
              {userIsEditor() && (
                <span
                  className="text-primary text-decoration-underline"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowAddMemberModal(true)}>
                  Add a member.
                </span>
              )}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
