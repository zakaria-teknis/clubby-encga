import { useState, useEffect } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useSettingsStore } from "../../../store/dashboard/settings";
import SuccessToast from "../../SuccessToast";

export default function UpdatePassword() {
  const {
    verifyPassword,
    updatePassword,
    validationErrors,
    passwordIsVerified,
    setPasswordIsVerified,
  } = useSettingsStore();
  const verifyPasswordIsLoading = useSettingsStore(
    (state) => state.loadingStates["VerifyPassword"]
  );
  const updatePasswordIsLoading = useSettingsStore(
    (state) => state.loadingStates["UpdatePassword"]
  );

  useEffect(() => {
    return () => {
      setPasswordIsVerified(false);
    };
  }, []);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const validationErrorElement = (element) => {
    return (
      validationErrors &&
      validationErrors.some((error) => error.element.includes(element))
    );
  };

  const validationErrorMessage = (element) => {
    const error =
      validationErrors &&
      validationErrors.find((error) => error.element.includes(element));
    return error.message;
  };

  const handleSuccessToastEnter = () => {
    setOldPassword("");
    setNewPassword("");
  };

  const handleVerifyPassword = () => {
    verifyPassword(oldPassword);
  };

  const handleUpdatePassword = () => {
    updatePassword(newPassword);
  };

  return (
    <>
      <SuccessToast handleSuccessToastEnter={handleSuccessToastEnter} />

      <div className="d-flex flex-wrap py-4 border-bottom gap-4 justify-content-between">
        <div>
          <h5 className="fw-bold mb-3">Change password</h5>
          <p className="text-secondary mb-0">
            Enter your old password before making changes.
          </p>
        </div>
        <Form className="w-100 max-w-md">
          <Form.Group className="w-100 mb-3" controlId="formOldPassword">
            <Form.Label className="fw-semibold">Old password</Form.Label>
            <div className="d-flex gap-3">
              <div className="w-100">
                <Form.Control
                  type="password"
                  disabled={passwordIsVerified}
                  placeholder="Enter your old password"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                  isInvalid={validationErrorElement("old_password")}
                />
                {validationErrorElement("old_password") && (
                  <Form.Text className="text-danger">
                    {validationErrorMessage("old_password")}
                  </Form.Text>
                )}
              </div>
              <Button
                onClick={handleVerifyPassword}
                disabled={verifyPasswordIsLoading || passwordIsVerified}
                style={{ height: "fit-content" }}
                className="d-flex gap-2 align-items-center">
                {verifyPasswordIsLoading && (
                  <Spinner animation="border" variant="light" size="sm" />
                )}
                <span className="fw-semibold">Verify</span>
              </Button>
            </div>
          </Form.Group>

          {passwordIsVerified && (
            <Form.Group className="w-100" controlId="formNewPassword">
              <Form.Label className="fw-semibold">New password</Form.Label>
              <div className="d-flex gap-3">
                <div className="w-100">
                  <Form.Control
                    type="password"
                    placeholder="Enter your new password"
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                    value={newPassword}
                    isInvalid={validationErrorElement("new_password")}
                  />
                  {validationErrorElement("new_password") && (
                    <Form.Text className="text-danger">
                      {validationErrorMessage("new_password")}
                    </Form.Text>
                  )}
                </div>
                <Button
                  onClick={handleUpdatePassword}
                  disabled={updatePasswordIsLoading}
                  style={{ height: "fit-content" }}
                  className="d-flex gap-2 align-items-center">
                  {updatePasswordIsLoading && (
                    <Spinner animation="border" variant="light" size="sm" />
                  )}
                  <span className="fw-semibold">Save</span>
                </Button>
              </div>
            </Form.Group>
          )}
        </Form>
      </div>
    </>
  );
}
