import { Container, Image } from "react-bootstrap";
import clubbyLogo from "../assets/images/clubby-logo.png";

export default function Footer() {
  return (
    <Container
      fluid
      className="p-0 bg-body-tertiary">
      <div className="max-w-5xl py-5 px-4 mx-auto d-flex flex-column align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <Image className="w-7xs" src={clubbyLogo} rounded />
          <h5 className="mb-0">Clubby</h5>
        </div>
        <div className="pt-3 border-top w-100">
          <p className="mb-0 text-center">© 2025 Clubby. All rights reserved.</p>
        </div>
      </div>
    </Container>
  );
}
