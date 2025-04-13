import undrawCancel from "../../assets/images/undraw-cancel.svg";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ExpiredSignupLinkErrorPage() {
  return (
    <Container
      className="px-4 py-5 max-w-5xl d-flex flex-column align-items-center justify-content-center"
      style={{ height: "calc(100vh - 72px" }}>
      <img className="max-w-2xs mb-4" src={undrawCancel} />
      <h4 className="fw-bold text-center">This signup link has expired</h4>
      <p className="mb-0 text-center">
        <span>If you're still interested, please </span>
        <Link
          to="/request-signup"
          className="text-primary text-decoration-underline">
          <span>send a new request.</span>
        </Link>
      </p>
    </Container>
  );
}
