import { Form, Button } from "react-bootstrap";
import { FaXmark } from "react-icons/fa6";
import { useEventsStore } from "../../../store/dashboard/events";
import { useUserStore } from "../../../store/user";

export default function EventProgramStep({
  id,
  index,
  setProgramSteps,
  programSteps,
}) {
  const { validationErrors } = useEventsStore();
  const { user } = useUserStore();
  const createEventModalisLoading = useEventsStore(
    (state) => state.loadingStates["CreateEventModal"]
  );
  const editEventModalisLoading = useEventsStore(
    (state) => state.loadingStates["EditEventModal"]
  );

  const today = new Date().toISOString().split("T")[0];

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  const programStep = programSteps.find((step) => step.id === id);

  const validationErrorElement = (element, array) => {
    return (
      validationErrors &&
      validationErrors.some(
        (error) =>
          error.element.includes(element) &&
          error.id === id &&
          error.array === array
      )
    );
  };

  const validationErrorMessage = (element, array) => {
    const error =
      validationErrors &&
      validationErrors.find(
        (error) =>
          error.element.includes(element) &&
          error.id === id &&
          error.array === array
      );
    return error.message;
  };

  const handleTimeDisabled = () => {
    return programSteps.some((step) => step.id === id && step.date === "");
  };

  const handleDeleteStep = () => {
    setProgramSteps((prevProgramSteps) =>
      prevProgramSteps.filter((programStep) => programStep.id !== id)
    );
  };

  const updateStepProperty = (property, value) => {
    setProgramSteps((prevProgramStep) =>
      prevProgramStep.map((step) =>
        step.id === id ? { ...step, [property]: value } : step
      )
    );
  };

  return (
    <div className="d-flex flex-column rounded p-3 shadow gap-4">
      <div className="border-bottom pb-3 d-flex justify-content-between">
        <h6 className="fw-bold">Program Step {index + 1}</h6>
        {userIsEditor() && (
          <Button
            variant="light"
            disabled={createEventModalisLoading || editEventModalisLoading}
            onClick={handleDeleteStep}
            className="rounded-circle d-flex align-items-center p-1">
            <FaXmark size={16} />
          </Button>
        )}
      </div>

      <div className="d-flex flex-column flex-sm-row gap-3">
        <Form.Group className="flex-grow-1">
          <Form.Label className="fw-bold">Title</Form.Label>
          <Form.Control
            type="text"
            disabled={createEventModalisLoading || editEventModalisLoading}
            value={programStep.title}
            plaintext={!userIsEditor()}
            readOnly={!userIsEditor()}
            maxLength={100}
            placeholder="Give this step a title"
            onChange={(e) => updateStepProperty("title", e.target.value)}
            isInvalid={validationErrorElement("title", "program_steps")}
          />
          {validationErrorElement("title", "program_steps") && (
            <Form.Text className="text-danger">
              {validationErrorMessage("title", "program_steps")}
            </Form.Text>
          )}
        </Form.Group>
      </div>

      <div className="d-flex flex-column flex-sm-row gap-3">
        <div className="d-flex flex-column flex-grow-1 gap-4">
          <Form.Group className="flex-grow-1">
            <Form.Label className="fw-bold">Date</Form.Label>
            <Form.Control
              type="date"
              disabled={createEventModalisLoading || editEventModalisLoading}
              value={programStep.date}
              plaintext={!userIsEditor()}
              readOnly={!userIsEditor()}
              min={today}
              onChange={(e) => updateStepProperty("date", e.target.value)}
              isInvalid={validationErrorElement("date", "program_steps")}
            />
            {validationErrorElement("date", "program_steps") && (
              <Form.Text className="text-danger">
                {validationErrorMessage("date", "program_steps")}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="flex-grow-1">
            <Form.Label className="fw-bold">Time</Form.Label>
            <Form.Control
              type="time"
              value={programStep.time}
              plaintext={!userIsEditor()}
              readOnly={!userIsEditor()}
              disabled={
                handleTimeDisabled() ||
                createEventModalisLoading ||
                editEventModalisLoading
              }
              onChange={(e) => updateStepProperty("time", e.target.value)}
              isInvalid={validationErrorElement("time", "program_steps")}
            />
            {validationErrorElement("time", "program_steps") && (
              <Form.Text className="text-danger">
                {validationErrorMessage("time", "program_steps")}
              </Form.Text>
            )}
          </Form.Group>
        </div>

        <Form.Group className="flex-grow-1 d-flex flex-column">
          <Form.Label className="fw-bold">Description</Form.Label>
          <Form.Control
            className="flex-grow-1"
            as="textarea"
            disabled={createEventModalisLoading || editEventModalisLoading}
            value={programStep.description}
            plaintext={!userIsEditor()}
            readOnly={!userIsEditor()}
            placeholder={
              !userIsEditor() && !programStep.description
                ? "No description provided"
                : "Describe what's happening at this step..."
            }
            onChange={(e) => updateStepProperty("description", e.target.value)}
            maxLength={200}
          />
        </Form.Group>
      </div>
    </div>
  );
}
