import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store/user";
import undrawHighFive from "../../assets/images/undraw-high-five.svg";

export default function SignupPage() {
  const {
    getApprovedUser,
    signupUser,
    approvedUserEmail,
    validationErrors,
    setValidationErrors,
    setLoadingStates,
  } = useUserStore();
  const isLoading = useUserStore((state) => state.loadingStates["SignupPage"]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const params = new URLSearchParams(window.location.search);
  const signupToken = params.get("signupToken");

  useEffect(() => {
    if (signupToken) {
      getApprovedUser(signupToken);
    }
    return () => {
      setLoadingStates({});
      setValidationErrors([]);
    };
  }, [getApprovedUser]);

  useEffect(() => {
    if (approvedUserEmail) {
      setEmail(approvedUserEmail);
    }
  }, [approvedUserEmail]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    signupUser(email, password);
  };

  return (
    <Container
      fluid
      className="ps-0 py-5 px-4"
      style={{ minHeight: "calc(100vh - 72px)" }}>
      <Row>
        <Col
          lg={6}
          className="d-none d-lg-flex align-items-center justify-content-center">
          <div className="w-100 px-4 max-w-2xl">
            <img src={undrawHighFive} alt="Signup Illustration" />
          </div>
        </Col>

        <Col lg={6}>
          <div className="d-flex flex-column align-content-center gap-5 w-100">
            <p className="align-self-end">
              Already signed up?
              <Link to="/login" className="ms-1">
                Log in
                <BsArrowRightShort />
              </Link>
            </p>

            <div className="max-w-md mt-5 mx-auto w-100">
              <h3 className="fw-bold mb-3">Sign up</h3>
              <p className="mb-4">
                Congratulations on your approval! To complete your registration,
                please set your password.
              </p>

              <Form>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label className="fw-bold mb-2">Email</Form.Label>
                  <Form.Control
                    type="email"
                    plaintext
                    readOnly
                    value={email}
                    placeholder="Please wait for the token to be processed"
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label className="fw-bold mb-2">Password</Form.Label>
                  <Form.Control
                    type="password"
                    disabled={isLoading}
                    placeholder="Password"
                    value={password}
                    maxLength={64}
                    isInvalid={validationErrorElement("password")}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  {validationErrorElement("password") && (
                    <Form.Text className="text-danger">
                      {validationErrorMessage("password")}
                    </Form.Text>
                  )}
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    onClick={handleSubmit}>
                    Sign up
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
