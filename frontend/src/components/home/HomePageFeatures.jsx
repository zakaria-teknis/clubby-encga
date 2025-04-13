import { Container } from "react-bootstrap";
import { FaPeopleGroup } from "react-icons/fa6";
import { GiPartyFlags } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";

export default function HomePageFeatures() {
  return (
    <Container fluid className="p-0 bg-light">
      <div className="d-flex align-items-center justify-content-center max-w-5xl px-4 py-5 mx-auto gap-4 flex-wrap">
        <div className="d-flex flex-column gap-2">
          <FaPeopleGroup size={72} />
          <h4 className="fw-bold mb-0">Clubs</h4>
          <p className="text-body-secondary">All the clubs in one place</p>
        </div>
        <div className="d-flex flex-column gap-2">
          <GiPartyFlags size={72} />
          <h4 className="fw-bold mb-0">Events</h4>
          <p className="text-body-secondary">Discover the latest events</p>
        </div>
        <div className="d-flex flex-column gap-2">
          <IoIosPeople size={72} />
          <h4 className="fw-bold mb-0">Members</h4>
          <p className="text-body-secondary">Explore clubs communities</p>
        </div>
      </div>
    </Container>
  );
}
