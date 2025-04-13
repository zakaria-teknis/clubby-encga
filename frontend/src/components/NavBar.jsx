import { Nav, Navbar, Spinner, Button, Image } from "react-bootstrap";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { NavLink, useLocation } from "react-router-dom";
import { useUserStore } from "../store/user";
import clubbyLogo from "../assets/images/clubby-logo.png";
import NavBarResponsive from "./NavBarResponsive";
import DasboardNavBarResponsive from "./dashboard/DashboardNavBarResponsive";

export default function NavBar() {
  const { logoutUser, user } = useUserStore();
  const isLoading = useUserStore((state) => state.loadingStates["NavBar"]);

  const handleLogout = () => {
    logoutUser();
  };

  const location = useLocation();
  const isDashboardActive = location.pathname.startsWith("/dashboard");

  return (
    <Navbar
      className="bg-body-tertiary position-sticky top-0 d-flex align-items-center justify-content-between px-4 py-3"
      style={{ zIndex: "999" }}>
      {isDashboardActive && <DasboardNavBarResponsive />}

      <Navbar.Brand className="py-0" as={NavLink} to="/">
        <Image className="w-7xs" src={clubbyLogo} rounded />
      </Navbar.Brand>
      <Nav className="w-100 d-none d-lg-flex align-items-center justify-content-between">
        <div className="d-flex gap-1">
          <Nav.Link as={NavLink} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/clubs">
            Clubs
          </Nav.Link>
          <Nav.Link as={NavLink} to="/events">
            Events
          </Nav.Link>
          <Nav.Link as={NavLink} to="/contact">
            Contact
          </Nav.Link>
        </div>
        <div className="d-flex gap-2">
          {isLoading ? (
            <Spinner animation="border" role="status" size="sm" />
          ) : user ? (
            <>
              <Button as={NavLink} to="/dashboard" className="fw-semibold py-1">
                Dashboard
              </Button>
              <Button
                variant="light"
                onClick={handleLogout}
                className="fw-semibold py-1 d-flex align-items-center gap-1">
                <IoLogOut size={20} />
                <span>Log out</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                as={NavLink}
                to="/request-signup"
                className="fw-semibold py-1">
                Sign up
              </Button>
              <Button
                variant="light"
                as={NavLink}
                to="/login"
                className="fw-semibold d-flex py-1 align-items-center gap-1">
                <IoLogIn size={20} />
                <span>Log in</span>
              </Button>
            </>
          )}
        </div>
      </Nav>

      <NavBarResponsive />
    </Navbar>
  );
}
