import { Image, Button, Form } from "react-bootstrap";
import { BsImageFill, BsTrash3Fill } from "react-icons/bs";
import { useClubStore } from "../../../store/dashboard/club";
import defaultLogo from "../../../assets/images/default-logo.png";
import { useUserStore } from "../../../store/user";
import LoadingModal from "../../LoadingModal";

export default function ClubLogo() {
  const { club, updateClubLogo, deleteClubLogo } = useClubStore();
  const { user } = useUserStore();
  const clubLogoIsLoading = useClubStore(
    (state) => state.loadingStates["ClubLogo"]
  );

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  const handleUpdateLogo = (event) => {
    const file = event.target.files[0];
    updateClubLogo(file);
    event.target.value = "";
  };

  const handleDeleteLogo = () => {
    deleteClubLogo();
  };

  return (
    <>
      {clubLogoIsLoading && <LoadingModal />}
      <div
        className="d-flex mx-auto flex-column flex-sm-row gap-4 mx-sm-0 mb-5"
        style={{ width: "fit-content" }}>
        <Image
          src={club.logo_url ? club.logo_url : defaultLogo}
          roundedCircle
          fluid
          className="w-4xs h-4xs align-self-center"
        />
        {userIsEditor() && (
          <div
            className="d-flex gap-3 gap-sm-0 flex-column justify-content-start justify-content-sm-around"
            style={{ width: "fit-content" }}>
            <Button
              variant="outline-primary"
              disabled={clubLogoIsLoading}
              className="fw-bold border-2 py-2 px-4 d-flex align-items-center gap-2 position-relative">
              <BsImageFill />
              <span>Change</span>
              <Form.Control
                type="file"
                accept="image/*"
                name="profile-image"
                onChange={handleUpdateLogo}
                className="position-absolute opacity-0 w-100 h-100 top-0 start-0"
              />
            </Button>
            <Button
              disabled={clubLogoIsLoading || !club.logo_url}
              variant="outline-primary"
              className="fw-bold border-2 py-2 px-4 d-flex align-items-center gap-2"
              onClick={handleDeleteLogo}>
              <BsTrash3Fill />
              <span>Remove</span>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
