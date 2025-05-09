import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store/user";
import { useTestAppStore } from "../../store/public/testApp";

export default function LoginPage() {
  const { loginUser, validationErrors, setValidationErrors, setLoadingStates } =
    useUserStore();
  const isLoading = useUserStore((state) => state.loadingStates["LoginPage"]);
  const { setShowCredentials, showCredentials } = useTestAppStore();

  useEffect(() => {
    return () => {
      setValidationErrors([]);
      setLoadingStates({});
      setShowCredentials(false);
    };
  }, []);

  const [email, setEmail] = useState(
    showCredentials ? "zakariateknispro@gmail.com" : ""
  );
  const [password, setPassword] = useState(
    showCredentials ? "@ABCabc123!@" : ""
  );

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
    loginUser(email, password);
  };

  return (
    <Container
      fluid
      className="p-0"
      style={{ minHeight: "calc(100vh - 72px)" }}>
      <div className="max-w-5xl px-4 py-5 mx-auto">
        <div className="max-w-md mx-auto p-4">
          <h2 className="text-center mb-4">Log in to Clubby</h2>
          <Form className="mb-3 w-100" onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label className="fw-bold mb-2">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                maxLength={254}
                disabled={isLoading}
                isInvalid={validationErrorElement("email")}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              {validationErrorElement("email") && (
                <Form.Text className="text-danger">
                  {validationErrorMessage("email")}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label className="fw-bold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                maxLength={64}
                disabled={isLoading}
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

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isLoading}>
              Log in
            </Button>
          </Form>
          <div className="mb-1 text-center">
            <span>Haven't signed up yet?</span>
            <Link to="/request-signup" className="ms-1">
              <span>Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
