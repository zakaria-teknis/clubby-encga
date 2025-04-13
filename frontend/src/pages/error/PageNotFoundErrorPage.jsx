import undrawPageNotFound from "../../assets/images/undraw-page-not-found.svg";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function PageNotFoundErrorPage() {
  return (
    <Container
      className="px-4 py-5 max-w-5xl d-flex flex-column align-items-center justify-content-center"
      style={{ height: "calc(100vh - 72px" }}>
      <img className="max-w-2xs mb-4" src={undrawPageNotFound} />
      <h4 className="fw-bold text-center">Page not found</h4>
      <p className="mb-0 text-center">
        <span>Oops! The page you're looking for doesn't exist.</span>{" "}
        <Link to="/" className="text-primary text-decoration-underline">
          <span>Go back home.</span>
        </Link>
      </p>
    </Container>
  );
}
