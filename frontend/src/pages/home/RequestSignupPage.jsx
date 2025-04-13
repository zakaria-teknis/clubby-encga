import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store/user";
import { useGlobalStore } from "../../store/global";
import SuccessToast from "../../components/SuccessToast";
import undrawCareerProgress from "../../assets/images/undraw-career-progress.svg";

export default function RequestSignupPage() {
  const { setSuccess } = useGlobalStore();
  const {
    requestSignupUser,
    validationErrors,
    setValidationErrors,
    setLoadingStates,
  } = useUserStore();
  const isLoading = useUserStore(
    (state) => state.loadingStates["RequestSignupPage"]
  );

  useEffect(() => {
    return () => {
      setLoadingStates({});
      setValidationErrors([]);
      setSuccess("");
    };
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [club, setClub] = useState("");
  const [boardPosition, setBoardPosition] = useState("");
  const [isEditor, setIsEditor] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const formatString = (string) => {
    return string
      .replace(/\s+/g, " ")
      .trim()
      .split(/[-\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

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
    requestSignupUser(
      formatString(firstName),
      formatString(lastName),
      club,
      boardPosition,
      isEditor,
      phone,
      email
    );
  };

  const handleSuccessToastEnter = () => {
    setFirstName("");
    setLastName("");
    setClub("");
    setBoardPosition("");
    setIsEditor(false);
    setPhone("");
    setEmail("");
    setValidationErrors([]);
  };

  return (
    <>
      <SuccessToast handleSuccessToastEnter={handleSuccessToastEnter} />

      <Container fluid className="ps-0 py-5 px-4" style={{ minHeight: "calc(100vh - 72px)" }}>
        <Row>
          <Col
            lg={6}
            className="d-none d-lg-flex align-items-center justify-content-center">
            <div className="w-100 px-4 max-w-2xl">
              <img
                src={undrawCareerProgress}
                alt="Signup Illustration"
              />
            </div>
          </Col>

          <Col lg={6}>
            <div className="d-flex flex-column align-content-center gap-5 w-100">
              <div className="align-self-end">
                <span>Already signed up?</span>
                <Link to="/login" className="ms-1">
                  <span>Log in</span>
                  <BsArrowRightShort />
                </Link>
              </div>

              <div className="max-w-2xl w-100 mx-auto">
                <h3 className="fw-bold mb-3">Are you a board member?</h3>
                <p className="mb-4">
                  If you're a board member, please fill out this form. Our admin
                  will review your request, and you'll receive an email
                  confirming whether your approval was successful.
                </p>

                <Form>
                  <Form.Group controlId="formFirstName" className="mb-3">
                    <Form.Label className="fw-bold mb-2">First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      maxLength={35}
                      disabled={isLoading}
                      isInvalid={validationErrorElement("first_name")}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                    />
                    {validationErrorElement("first_name") && (
                      <Form.Text className="text-danger">
                        {validationErrorMessage("first_name")}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group controlId="formLastName" className="mb-3">
                    <Form.Label className="fw-bold mb-2">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      maxLength={35}
                      disabled={isLoading}
                      isInvalid={validationErrorElement("last_name")}
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                    />
                    {validationErrorElement("last_name") && (
                      <Form.Text className="text-danger">
                        {validationErrorMessage("last_name")}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group controlId="formClub" className="mb-3">
                    <Form.Label className="fw-bold mb-2">Club</Form.Label>
                    <Form.Select
                      value={club}
                      disabled={isLoading}
                      isInvalid={validationErrorElement("club")}
                      onChange={(e) => {
                        setClub(e.target.value);
                      }}>
                      <option value="" disabled>
                        Select your club
                      </option>
                      <option value="aikido-club-samurai">
                        Aikido Club Samurai
                      </option>
                      <option value="assais">Assais</option>
                      <option value="cdi">
                        Club du Digital et de l'Innovation
                      </option>
                      <option value="cop">
                        Club d'Orientation Pédagogique
                      </option>
                      <option value="eco-club">Eco Club</option>
                      <option value="enactus">Enactus</option>
                      <option value="entrepreneuriat">Entrepreneuriat</option>
                      <option value="hanmate">Hanmate</option>
                      <option value="is-club">
                        International Student Club
                      </option>
                      <option value="jlm">Jeunes Leaders Marocains</option>
                      <option value="jtc">Junior Traders Club</option>
                      <option value="kiproko">Kiproko</option>
                      <option value="lions">Lions</option>
                      <option value="pressnap">Pressnap</option>
                      <option value="rcc">Readers' Corner Club</option>
                      <option value="riu">Riu</option>
                      <option value="rotaracat">Rotaracat</option>
                      <option value="sankofa">Sankofa</option>
                      <option value="sharks-basketball">
                        Sharks Basketball
                      </option>
                      <option value="sharks-chess">Sharks Chess</option>
                      <option value="sharks-football">Sharks Football</option>
                      <option value="sharks-handball">Sharks Handball</option>
                      <option value="sharks-taekwondo">Sharks Taekwondo</option>
                      <option value="sharks-volleyball">
                        Sharks Volleyball
                      </option>
                      <option value="sport-for-dev">
                        Sport For Development
                      </option>
                      <option value="7th-art">
                        The Seventh Art Cinema Club
                      </option>
                      <option value="the-great-debaters">
                        The Great Debaters
                      </option>
                      <option value="tolerance">Tolerance</option>
                      <option value="ultras-rebirth">Ultras Rebirth</option>
                      <option value="unleashed">Unleashed</option>
                      <option value="vinyl">Vinyl</option>
                    </Form.Select>
                    {validationErrorElement("club") && (
                      <Form.Text className="text-danger">
                        {validationErrorMessage("club")}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group controlId="formBoardPosition" className="mb-3">
                    <Form.Label className="fw-bold mb-2">
                      Board Position
                    </Form.Label>
                    <Form.Select
                      value={boardPosition}
                      disabled={isLoading}
                      isInvalid={validationErrorElement("board_position")}
                      onChange={(e) => {
                        setBoardPosition(e.target.value);
                      }}>
                      <option value="" disabled>
                        Select your board position
                      </option>
                      <option value="president">President</option>
                      <option value="vice-president">Vice President</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="general-secretary">
                        General Secretary
                      </option>
                      <option value="communications-manager">
                        Communications Manager
                      </option>
                      <option value="human-ressources-manager">
                        Human Ressources Manager
                      </option>
                      <option value="logistics-manager">
                        Logistics Manager
                      </option>
                    </Form.Select>
                    {validationErrorElement("board_position") && (
                      <Form.Text className="text-danger">
                        {validationErrorMessage("board_position")}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group controlId="formRole" className="mb-3">
                    <Form.Label className="fw-bold mb-2">Role</Form.Label>
                    <Form.Check
                      type="checkbox"
                      disabled={isLoading}
                      id="Editor"
                      label="Editor"
                      checked={isEditor}
                      onChange={(e) => setIsEditor(e.target.checked)}
                      isInvalid={validationErrorElement("role")}
                    />
                    {validationErrorElement("role") && (
                      <Form.Text className="text-danger">
                        {validationErrorMessage("role")}
                      </Form.Text>
                    )}
                    <small className="d-block mt-2">
                      P.S.: Each club can have only one editor, responsible for
                      adding or editing members, events, and club information.
                    </small>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Phone</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>+212</InputGroup.Text>
                      <Form.Control
                        type="tel"
                        maxLength={9}
                        value={phone}
                        disabled={isLoading}
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        placeholder="(6 or 7) XX XX XX XX"
                        isInvalid={validationErrorElement("phone")}
                      />
                    </InputGroup>
                    {validationErrorElement("phone") && (
                      <Form.Text className="text-danger">
                        {validationErrorMessage("phone")}
                      </Form.Text>
                    )}
                  </Form.Group>

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
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={isLoading}
                    onClick={handleSubmit}>
                    Submit
                  </Button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
