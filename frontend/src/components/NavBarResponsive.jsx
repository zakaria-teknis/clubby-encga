import { useState } from "react";
import {
  Nav,
  Offcanvas,
  Row,
  Col,
  Spinner,
  Button,
  Image,
} from "react-bootstrap";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import clubbyLogo from "../assets/images/clubby-logo.png";
import { BsThreeDots } from "react-icons/bs";
import { useUserStore } from "../store/user";

export default function NavBarResponsive() {
  const { user, logoutUser } = useUserStore();
  const isLoading = useUserStore((state) => state.loadingStates["NavBar"]);

  const [show, setShow] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setShow(false);
  };

  return (
    <>
      <div
        role="button"
        className="d-block d-lg-none py-1"
        onClick={() => setShow(true)}>
        <BsThreeDots size={24} />
      </div>

      <Offcanvas
        show={show}
        placement="end"
        onHide={() => setShow(false)}
        className="px-4">
        <Offcanvas.Header className="border-bottom px-0 py-3" closeButton>
          <Offcanvas.Title className="py-0">
            <Image className="w-7xs" src={clubbyLogo} rounded />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <Nav>
            <Row className="border-bottom py-3">
              <Col className="px-0">
                <Nav.Link
                  as={NavLink}
                  to="/"
                  onClick={() => setShow(false)}
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                  })}>
                  Home
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/clubs"
                  onClick={() => setShow(false)}
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                  })}>
                  Clubs
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/events"
                  onClick={() => setShow(false)}
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                  })}>
                  Events
                </Nav.Link>
              </Col>
              <Col>
                <Nav.Link
                  as={NavLink}
                  to="/contact"
                  onClick={() => setShow(false)}
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                  })}>
                  Contact
                </Nav.Link>
              </Col>
            </Row>
            <Row className="py-3">
              {isLoading ? (
                <Col>
                  <Spinner animation="border" role="status" size="sm" />
                </Col>
              ) : user ? (
                <>
                  <Col className="px-0">
                    <Button
                      as={NavLink}
                      to="/dashboard"
                      onClick={() => setShow(false)}
                      className="fw-semibold py-1">
                      Dashboard
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="light"
                      onClick={handleLogout}
                      className="fw-semibold py-1 d-flex align-items-center gap-1">
                      <IoLogOut size={20} />
                      <span>Log out</span>
                    </Button>
                  </Col>
                </>
              ) : (
                <>
                  <Col className="px-0">
                    <Button
                      as={NavLink}
                      to="/request-signup"
                      onClick={() => setShow(false)}
                      className="fw-semibold py-1">
                      Sign up
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="light"
                      as={NavLink}
                      to="/login"
                      onClick={() => setShow(false)}
                      className="fw-semibold d-flex py-1 align-items-center gap-1"
                      style={{ width: "fit-content" }}>
                      <IoLogIn size={20} />
                      <span>Log in</span>
                    </Button>
                  </Col>
                </>
              )}
            </Row>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
