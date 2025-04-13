import { useEffect } from "react";
import { Container } from "react-bootstrap";
import RequestsTable from "../../components/dashboard/requests/RequestsTable";
import { useGlobalStore } from "../../store/global";
import { useRequestStore } from "../../store/dashboard/request";
import SuccessToast from "../../components/SuccessToast";
import ErrorToast from "../../components/ErrorToast";
import DashboardNavBar from "../../components/dashboard/DashboardNavBar";

export default function DashboardRequestsPage() {
  const { setError, setSuccess } = useGlobalStore();
  const { getRequests, setLoadingStates } = useRequestStore();

  useEffect(() => {
    getRequests();
    return () => {
      setLoadingStates({});
      setError("");
      setSuccess("");
    };
  }, []);

  return (
    <>
      <SuccessToast />
      <ErrorToast />

      <Container fluid className="py-5 px-0 max-w-5xl">
        <h2 className="mb-2 ms-4 me-5 fw-bold">Requests</h2>
        <p className="ms-4 me-5 mb-5 text-body-secondary">
          Board members can request access to the dashboard. Once approved, they
          will get a link to sign up. Please make sure the person is actually in
          their role before approving.
        </p>
        <RequestsTable />
      </Container>
    </>
  );
}
