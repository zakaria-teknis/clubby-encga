import { Toast } from "react-bootstrap";
import { useGlobalStore } from "../store/global";
import { FaCircleXmark } from "react-icons/fa6";

export default function ErrorToast({ handleErrorToastEnter }) {
  const { error, setError } = useGlobalStore();

  return (
    <Toast
      show={error && typeof error === "string" ? true : false}
      autohide
      bg="light"
      onEnter={handleErrorToastEnter ? handleErrorToastEnter : undefined}
      onClose={() => setError("")}
      className={`position-fixed start-50 top-0 translate-middle-x mt-3 ${
        !error && "d-none"
      }`}
      style={{ zIndex: "9999" }}>
      <Toast.Body className="fw-semibold d-flex justify-content-start align-items-center gap-2">
        <FaCircleXmark size={16} />
        {error}
      </Toast.Body>
    </Toast>
  );
}
