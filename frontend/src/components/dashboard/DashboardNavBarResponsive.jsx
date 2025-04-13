import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Offcanvas, Image } from "react-bootstrap";
import {
  BsPersonPlusFill,
  BsPersonCircle,
  BsPeopleFill,
  BsList,
} from "react-icons/bs";
import { FaUserTie, FaPeopleGroup, FaGear } from "react-icons/fa6";
import { BiSolidParty } from "react-icons/bi";
import clubbyLogo from "../../assets/images/clubby-logo.png";
import classes from "./DashboardNavBar.module.css";

export default function DasboardNavBarResponsive() {
  const [show, setShow] = useState(false);

  return (
    <>
      <div
        role="button"
        className="d-block d-lg-none py-1"
        onClick={() => setShow(true)}>
        <BsList size={24} />
      </div>

      <Offcanvas show={show} onHide={() => setShow(false)} className="px-4">
        <Offcanvas.Header className="border-bottom px-0 py-3" closeButton>
          <Offcanvas.Title className="py-0">
            <Image className="w-7xs" src={clubbyLogo} rounded />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0 px-0">
          <Nav className="py-3 d-flex flex-column gap-2">
            <Nav.Link
              as={NavLink}
              to="/dashboard/profile"
              onClick={() => setShow(false)}
              className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                backgroundColor: isActive
                  ? "rgb(226, 227, 229)"
                  : "transparent",
              })}
              variant="light">
              <BsPersonCircle size={20} />
              <span>Profile</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/dashboard/requests"
              onClick={() => setShow(false)}
              className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                backgroundColor: isActive
                  ? "rgb(226, 227, 229)"
                  : "transparent",
              })}
              variant="light">
              <BsPersonPlusFill size={20} />
              <span>Requests</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/dashboard/board"
              onClick={() => setShow(false)}
              className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                backgroundColor: isActive
                  ? "rgb(226, 227, 229)"
                  : "transparent",
              })}
              variant="light">
              <FaUserTie size={20} />
              <span>Board</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/dashboard/members"
              onClick={() => setShow(false)}
              className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                backgroundColor: isActive
                  ? "rgb(226, 227, 229)"
                  : "transparent",
              })}
              variant="light">
              <BsPeopleFill size={20} />
              <span>Members</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/dashboard/club"
              onClick={() => setShow(false)}
              className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                backgroundColor: isActive
                  ? "rgb(226, 227, 229)"
                  : "transparent",
              })}
              variant="light">
              <FaPeopleGroup size={20} />
              <span>Club</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/dashboard/events"
              onClick={() => setShow(false)}
              className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                backgroundColor: isActive
                  ? "rgb(226, 227, 229)"
                  : "transparent",
              })}
              variant="light">
              <BiSolidParty size={20} />
              <span>Events</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/dashboard/settings"
              onClick={() => setShow(false)}
              className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                backgroundColor: isActive
                  ? "rgb(226, 227, 229)"
                  : "transparent",
              })}
              variant="light">
              <FaGear size={20} />
              <span>Settings</span>
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
