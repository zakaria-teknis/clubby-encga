import { Table, Spinner } from "react-bootstrap";
import { BsInboxFill } from "react-icons/bs";
import RequestsTableRow from "./RequestsTableRow";
import { useRequestStore } from "../../../store/dashboard/request";

export default function RequestsTable() {
  const { requests } = useRequestStore();
  const isLoading = useRequestStore(
    (state) => state.loadingStates["RequestsTable"]
  );

  return (
    <Table responsive className="w-100 min-w-4xl">
      <thead>
        <tr className="border-top">
          <th className="ps-4">Name</th>
          <th>Club & Position</th>
          <th>Role</th>
          <th>Date</th>
          <th>Decision</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan="5" className="text-center py-5 text-body-tertiary">
              <Spinner animation="border" />;
            </td>
          </tr>
        ) : requests && requests.length > 0 ? (
          requests.map((request) => (
            <RequestsTableRow
              key={request._id}
              firstName={request.first_name}
              lastName={request.last_name}
              club={request.club}
              boardPosition={request.board_position}
              role={request.role}
              phone={request.phone}
              email={request.email}
              createdAt={request.createdAt}
              status={request.status}
              id={request._id}
            />
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-5 text-body-tertiary">
              <BsInboxFill size={56} className="mb-2" />
              <h6 className="mb-0">No requests pending</h6>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
