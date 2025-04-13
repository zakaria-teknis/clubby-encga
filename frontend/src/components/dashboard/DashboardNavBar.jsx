import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { BsPersonPlusFill, BsPersonCircle, BsPeopleFill } from "react-icons/bs";
import { BiSolidParty } from "react-icons/bi";
import { FaUserTie, FaPeopleGroup, FaGear } from "react-icons/fa6";
import { useUserStore } from "../../store/user";
import classes from "./DashboardNavBar.module.css";

export default function DashboardNavBar() {
  const { user } = useUserStore();

  return (
    <Nav
      className="d-none position-sticky d-lg-flex flex-column flex-shrink-0 px-3 py-4 gap-2 w-3xs"
      style={{ top: "72px", height: "calc(100vh - 72px)" }}>
      <Nav.Link
        as={NavLink}
        to="/dashboard/profile"
        className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
        style={({ isActive }) => ({
          fontWeight: isActive ? "bold" : "normal",
          backgroundColor: isActive ? "rgb(226, 227, 229)" : "transparent",
        })}>
        <BsPersonCircle size={20} />
        <span>Profile</span>
      </Nav.Link>
      {user && user.role.some((role) => role === "admin") && (
        <Nav.Link
          as={NavLink}
          to="/dashboard/requests"
          className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
          style={({ isActive }) => ({
            fontWeight: isActive ? "bold" : "normal",
            backgroundColor: isActive ? "rgb(226, 227, 229)" : "transparent",
          })}>
          <BsPersonPlusFill size={20} />
          <span>Requests</span>
        </Nav.Link>
      )}
      <Nav.Link
        as={NavLink}
        to="/dashboard/board"
        className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
        style={({ isActive }) => ({
          fontWeight: isActive ? "bold" : "normal",
          backgroundColor: isActive ? "rgb(226, 227, 229)" : "transparent",
        })}>
        <FaUserTie size={20} />
        <span>Board</span>
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        to="/dashboard/members"
        className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
        style={({ isActive }) => ({
          fontWeight: isActive ? "bold" : "normal",
          backgroundColor: isActive ? "rgb(226, 227, 229)" : "transparent",
        })}>
        <BsPeopleFill size={20} />
        <span>Members</span>
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        to="/dashboard/club"
        className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
        style={({ isActive }) => ({
          fontWeight: isActive ? "bold" : "normal",
          backgroundColor: isActive ? "rgb(226, 227, 229)" : "transparent",
        })}>
        <FaPeopleGroup size={20} />
        <span>Club</span>
      </Nav.Link>{" "}
      <Nav.Link
        as={NavLink}
        to="/dashboard/events"
        className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
        style={({ isActive }) => ({
          fontWeight: isActive ? "bold" : "normal",
          backgroundColor: isActive ? "rgb(226, 227, 229)" : "transparent",
        })}>
        <BiSolidParty size={20} />
        <span>Events</span>
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        to="/dashboard/settings"
        className={`d-flex align-items-center gap-2 py-2 px-3 rounded text-body ${classes.navLink}`}
        style={({ isActive }) => ({
          fontWeight: isActive ? "bold" : "normal",
          backgroundColor: isActive ? "rgb(226, 227, 229)" : "transparent",
        })}>
        <FaGear size={20} />
        <span>Settings</span>
      </Nav.Link>
    </Nav>
  );
}
