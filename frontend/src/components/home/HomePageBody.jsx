import { Container } from "react-bootstrap";
import undrawTeam from "../../assets/images/undraw-team.svg";
import undrawPartying from "../../assets/images/undraw-partying.svg";

export default function HomePageBody() {
  return (
    <Container fluid className="p-0">
      <div className="max-w-5xl px-4 py-5 mx-auto d-flex flex-column justify-content-center gap-5">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4">
          <div className="order-2 order-md-0 max-w-xl">
            <h2 className="fw-bold mb-3">All the clubs in one place</h2>
            <p className="text-body-secondary mb-4">
              No more wasting time searching for clubs on Instagram—everything
              you need is right here in one place, easy to find and explore!
            </p>
          </div>
          <div className="w-100 max-w-xl d-flex justify-content-center align-items-center">
            <img className="max-w-2xs" src={undrawTeam}></img>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4">
          <div className="order-2 max-w-xl">
            <h2 className="fw-bold mb-3">All the events in one place </h2>
            <p className="text-body-secondary mb-4">
              Stop missing out on great events just because you didn't know they
              were happening! From parties to conferences, find everything in
              one place and stay updated.
            </p>
          </div>
          <div className="w-100 max-w-xl d-flex justify-content-center align-items-center">
            <img className="max-w-2xs" src={undrawPartying}></img>
          </div>
        </div>
      </div>
    </Container>
  );
}
