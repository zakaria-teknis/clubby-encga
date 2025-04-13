import { Toast } from "react-bootstrap";
import { useGlobalStore } from "../store/global";
import { FaCircleCheck } from "react-icons/fa6";

export default function SuccessToast({ handleSuccessToastEnter }) {
  const { success, setSuccess } = useGlobalStore();

  return (
    <Toast
      show={success ? true : false}
      autohide
      bg="light"
      onEnter={handleSuccessToastEnter ? handleSuccessToastEnter : undefined}
      onClose={() => setSuccess("")}
      className={`position-fixed start-50 top-0 translate-middle-x mt-3 ${
        !success && "d-none"
      }`}
      style={{ zIndex: "9999" }}>
      <Toast.Body className="fw-semibold d-flex justify-content-start align-items-center gap-2">
        <FaCircleCheck size={16} />
        {success}
      </Toast.Body>
    </Toast>
  );
}
