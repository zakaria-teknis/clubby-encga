import { useState } from "react";
import { Container, Image, Form, Button } from "react-bootstrap";
import creator from "../../assets/images/creator.png";
import validator from "validator";

export default function ContactPage() {
  const [validationErrors, setValidationErrors] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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
    const localValidationErrors = [];

    if (!name.trim()) {
      localValidationErrors.push({
        element: ["name"],
        message: "Name cannot be blank",
      });
    }

    if (!email.trim()) {
      localValidationErrors.push({
        element: ["email"],
        message: "Email cannot be blank",
      });
    }

    if (!message.trim()) {
      localValidationErrors.push({
        element: ["message"],
        message: "Message cannot be blank",
      });
    }

    if (!validator.isEmail(email)) {
      localValidationErrors.push({
        element: ["email"],
        message: "Email is not valid",
      });
    }

    setValidationErrors(localValidationErrors);

    if (localValidationErrors.length > 0) e.preventDefault();
  };

  return (
    <Container
      fluid
      className="p-0"
      style={{ minHeight: "calc(100vh - 72px)" }}>
      <div className="max-w-5xl px-4 py-5 mx-auto">
        <h1 className="fw-bold mb-5">Contact</h1>
        <div className="d-flex w-100 justify-content-center align-items-center flex-wrap gap-5">
          <div className="d-flex flex-column flex-sm-row align-items-center gap-4 max-w-lg">
            <Image
              src={creator}
              roundedCircle
              className="w-3xs h-3xs flex-shrink-0"
            />
            <p className="fst-italic">
              Hi there! Feel free to reach out through this form for any
              suggestions, bug reports, or ideas you'd like to share. I'm always
              open to feedback. Looking forward to hearing from you! Best
              regards, Zak.
            </p>
          </div>

          <Form
            className="w-100 max-w-md p-3 shadow rounded"
            noValidate
            action="https://formspree.io/f/xldjpjkr"
            method="POST"
            onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                maxLength={70}
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                isInvalid={validationErrorElement("name")}
              />
              {validationErrorElement("name") && (
                <Form.Text className="text-danger">
                  {validationErrorMessage("name")}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                maxLength={254}
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Enter your email"
                isInvalid={validationErrorElement("email")}
              />
              {validationErrorElement("email") && (
                <Form.Text className="text-danger">
                  {validationErrorMessage("email")}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Message</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="This is the best app I've ever used..."
                maxLength={250}
                value={message}
                name="message"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                isInvalid={validationErrorElement("message")}
              />
              {validationErrorElement("message") && (
                <Form.Text className="text-danger">
                  {validationErrorMessage("message")}
                </Form.Text>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Send
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
}
