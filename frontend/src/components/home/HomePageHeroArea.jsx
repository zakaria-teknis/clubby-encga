import { Button, Container } from "react-bootstrap";
import { FaPeopleGroup } from "react-icons/fa6";
import { BiSolidParty } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import undrawTeamUp from "../../assets/images/undraw-team-up.svg";

export default function HomePageHeroArea() {
  return (
    <Container fluid className="p-0">
      <div
        className="d-flex align-items-center max-w-5xl px-4 py-5 mx-auto gap-4"
        style={{ height: "calc(100vh - 72px" }}>
        <div>
          <h1 className="fw-bold mb-3">
            Discover all clubs & events in one place!{" "}
          </h1>
          <p className="text-body-secondary mb-4">
            Never miss out on club activities or exciting events—explore
            everything happening on campus, all in one place.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3">
            <Button
              as={NavLink}
              to="/clubs"
              className="d-flex align-items-center justify-content-center gap-2">
              <FaPeopleGroup size={20} />
              <span>Discover clubs</span>
            </Button>
            <Button
              as={NavLink}
              to="/events"
              className="d-flex align-items-center justify-content-center gap-2"
              variant="light">
              <BiSolidParty size={20} />
              <span>Discover events</span>
            </Button>
          </div>
        </div>
        <div className="w-50 d-none d-md-flex flex-shrink-0 justify-content-center">
          <img className="max-w-xs" src={undrawTeamUp}></img>
        </div>
      </div>
    </Container>
  );
}
