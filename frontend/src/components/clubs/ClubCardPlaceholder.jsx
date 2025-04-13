import { Image, Placeholder } from "react-bootstrap";

export default function ClubCardPlaceholder({ logo, name }) {
  return (
    <div className="d-flex flex-column w-3xs mb-5 align-items-center justify-content-center">
      <div>
        <Image
          className="border w-4xs h-4xs border-primary-subtle mb-2 bg-body-secondary"
          roundedCircle
        />
      </div>
      <Placeholder as="h6" className="w-4xs" />
    </div>
  );
}
