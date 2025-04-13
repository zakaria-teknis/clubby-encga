import { Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ClubCard({ logo, name }) {
  const navigate = useNavigate();

  const formatClub = (club) => {
    let formattedClub = club;

    formattedClub = formattedClub
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (club === "jlm") formattedClub = "Jeunes Leaders Marocains";
    if (club === "cop") formattedClub = "Club d'Orientation Pédagogique";
    if (club === "cdi") formattedClub = "Club du Digital et de l'Innovation";
    if (club === "rcc") formattedClub = "Readers' Corner Club";
    if (club === "sport-for-dev") formattedClub = "Sport For Development";
    if (club === "is-club") formattedClub = "International Student Club";
    if (club === "jtc") formattedClub = "Junior Traders Club";

    return formattedClub;
  };

  const handleClick = () => {
    navigate(`/clubs/${name}`);
  };

  return (
    <div
      className="d-flex flex-column w-3xs mb-5 align-items-center justify-content-center"
      style={{ cursor: "pointer" }}
      onClick={handleClick}>
      <div>
        <Image
          src={logo}
          className="border w-4xs h-4xs border-primary-subtle mb-2"
          roundedCircle
        />
      </div>
      <h6 className="text-center">{formatClub(name)}</h6>
    </div>
  );
}
