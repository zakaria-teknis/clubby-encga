import { Spinner } from "react-bootstrap";

export default function LoadingModal() {
  return (
    <div
      className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 vw-100 vh-100 bg-dark bg-opacity-50"
      style={{ zIndex: "9999" }}>
      <Spinner variant="light" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
