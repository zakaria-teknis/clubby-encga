import { Card, Image, Placeholder } from "react-bootstrap";

export default function EventCardPlaceholder() {
  return (
    <Card className="w-sm h-md">
      <div
        className="position-relative w-100 h-50"
        style={{ marginBottom: "77px" }}>
        <Image fluid className="h-100 bg-body-secondary" />
        <Image
          roundedCircle
          fluid
          className="w-5xs bg-body-secondary h-5xs position-absolute border border-dark-subtle border-2"
          style={{ bottom: "-77px", left: "16px" }}
        />
      </div>
      <Card.Body>
        <Card.Title>
          <Placeholder className="w-50" />
        </Card.Title>
        <Card.Text>
          <Placeholder className="w-100" />
        </Card.Text>
        <div className="d-flex gap-2">
          <Placeholder className="w-25" /> <Placeholder className="w-500" />
          <Placeholder className="w-25" /> <Placeholder className="w-500" />
        </div>
      </Card.Body>
    </Card>
  );
}
