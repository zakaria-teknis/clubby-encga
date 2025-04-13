import { Container } from "react-bootstrap";
import EventList from "../../components/events/EventList";

export default function EventsPage() {
  return (
    <Container
      fluid
      className="p-0"
      style={{ minHeight: "calc(100vh - 72px)" }}>
      <EventList />
    </Container>
  );
}
