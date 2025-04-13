import { Image, Button, Form } from "react-bootstrap";
import { BsImageFill, BsTrash3Fill } from "react-icons/bs";
import { useProfileStore } from "../../../store/dashboard/profile";
import { useUserStore } from "../../../store/user";
import defaultProfileImage from "../../../assets/images/default-profile-image.png";
import LoadingModal from "../../LoadingModal";

export default function ProfileImage() {
  const { updateProfileImage, deleteProfileImage } = useProfileStore();
  const { user } = useUserStore();
  const profileImageIsLoading = useProfileStore(
    (state) => state.loadingStates["ProfileImage"]
  );

  const handleUpdateProfileImage = (event) => {
    const file = event.target.files[0];
    updateProfileImage(file);
    event.target.value = "";
  };

  const handleDeleteProfileImage = () => {
    deleteProfileImage();
  };

  return (
    <>
      {profileImageIsLoading && <LoadingModal />}
      <div
        className="d-flex mx-auto flex-column flex-sm-row gap-4 mx-sm-0 mb-5"
        style={{ width: "fit-content" }}>
        <Image
          src={
            user.profile_image_url
              ? user.profile_image_url
              : defaultProfileImage
          }
          roundedCircle
          fluid
          className="w-4xs h-4xs align-self-center"
        />
        <div
          className="d-flex gap-3 gap-sm-0 flex-column justify-content-start justify-content-sm-around"
          style={{ width: "fit-content" }}>
          <Button
            variant="outline-primary"
            disabled={profileImageIsLoading}
            className="fw-bold border-2 py-2 px-4 d-flex align-items-center gap-2 position-relative">
            <BsImageFill />
            <span>Change</span>
            <Form.Control
              type="file"
              accept="image/*"
              name="profile-image"
              onChange={handleUpdateProfileImage}
              className="position-absolute opacity-0 w-100 h-100 top-0 start-0"
            />
          </Button>
          <Button
            disabled={profileImageIsLoading || !user.profile_image_url}
            variant="outline-primary"
            className="fw-bold border-2 py-2 px-4 d-flex align-items-center gap-2"
            onClick={handleDeleteProfileImage}>
            <BsTrash3Fill />
            <span>Remove</span>
          </Button>
        </div>
      </div>
    </>
  );
}
