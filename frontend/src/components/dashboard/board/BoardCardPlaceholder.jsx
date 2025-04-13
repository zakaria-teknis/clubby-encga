import { Placeholder, Container } from "react-bootstrap";

export default function BoardCardPlaceholder() {
  return (
    <Container className="p-0 d-flex max-w-sm flex-shrink-0 gap-3 h-3xs">
      <div
        className="w-50 bg-body-secondary rounded overflow-hidden d-flex 
         justify-content-center align-items-center"></div>
      <div className="d-flex flex-column py-2 h-100 w-50">
        <Placeholder className="w-50 mb-3" as="h5" />
        <Placeholder className="w-50 mb-3" as="h6" />

        <Placeholder className="w-100 mb-2" as="p" />
        <Placeholder className="w-100 mb-2" as="p" />
        <Placeholder className="w-75" as="p" />

        <div className="d-flex gap-3">
          <Placeholder className="w-50" />
        </div>
      </div>
    </Container>
  );
}
