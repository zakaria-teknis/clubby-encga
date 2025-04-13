import undrawServerDown from "../../assets/images/undraw-server-down.svg";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function GeneralErrorPage() {
  return (
    <Container
      className="px-4 py-5 max-w-5xl d-flex flex-column align-items-center justify-content-center"
      style={{ height: "calc(100vh - 72px" }}>
      <img className="max-w-2xs mb-4" src={undrawServerDown} />
      <h4 className="fw-bold text-center">Something went wrong</h4>
      <p className="mb-0 text-center">
        <span>
          Please check your connection and try again later. If the issue
          persists,{" "}
        </span>
        <Link
          to="/contact"
          className="text-primary text-decoration-underline">
          <span>contact us.</span>
        </Link>
      </p>
    </Container>
  );
}
