import { Container } from "react-bootstrap";
import ClubList from "../../components/clubs/ClubList";

export default function ClubsPage() {
  return (
    <Container
      fluid
      className="p-0"
      style={{ minHeight: "calc(100vh - 72px)" }}>
      <ClubList />
    </Container>
  );
}
