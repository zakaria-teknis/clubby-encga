import { Image, Placeholder } from "react-bootstrap";

export default function ClubPageBoardCardPlaceholder({}) {
  const handleShowDetails = () => {};

  return (
    <div
      className="d-flex flex-column w-4xs align-items-center justify-content-center mb-4"
      onClick={handleShowDetails}
      style={{ cursor: "pointer" }}>
      <div>
        <Image
          className="border w-5xs h-5xs bg-body-secondary border-primary-subtle mb-3"
          roundedCircle
        />
      </div>
      <Placeholder className="mb-1 w-4xs" as="h5" />
      <Placeholder className="mb-1 w-5xs" as="span" />
    </div>
  );
}
