import { Image, Placeholder } from "react-bootstrap";
import eventCoverImagePlaceholder from "../../assets/images/event-cover-image-placeholder.png";

export default function UpcomingEventCardPlaceholder({}) {
  return (
    <div className="d-flex flex-column flex-md-row align-items-center border-bottom py-3">
      <div className="max-w-xs rounded">
        <Image className="rounded" src={eventCoverImagePlaceholder} />
      </div>
      <div className="d-flex flex-column flex-sm-row gap-4 p-4 justify-content-between align-items-center w-100">
        <div className="d-flex gap-2 flex-column align-items-center align-items-sm-start">
          <Placeholder as="h4" className="w-4xs" />
          <Placeholder as="span" className="w-3xs" />
          <div className="d-flex flex-column flex-lg-row align-items-center gap-2">
            <Placeholder as="span" className="w-4xs" />
            <Placeholder as="span" className="w-4xs" />
          </div>
        </div>
        <Placeholder as="h2" className="w-5xs mb-0" />
      </div>
    </div>
  );
}
