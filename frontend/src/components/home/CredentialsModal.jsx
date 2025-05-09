import { Modal, Button } from "react-bootstrap";
import { useTestAppStore } from "../../store/public/testApp";

export default function CredentialsModal() {
  const { showCredentialsModal, setShowCredentialsModal } = useTestAppStore();

  return (
    <Modal
      centered
      show={showCredentialsModal}
      onHide={() => setShowCredentialsModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Welcome to Clubby!</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h6>Please use these credentials to test the app:</h6>
        <p className="mb-0">
          <span className="fw-semibold">Email</span>: zakariateknispro@gmail.com
        </p>
        <p className="mb-0">
          <span className="fw-semibold">Password</span>: @ABCabc123!@
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowCredentialsModal(false)}>
          Later
        </Button>
        <Button variant="primary">Test the app</Button>
      </Modal.Footer>
    </Modal>
  );
}
