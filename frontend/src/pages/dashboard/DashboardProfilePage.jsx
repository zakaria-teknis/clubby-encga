import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useGlobalStore } from "../../store/global";
import { useProfileStore } from "../../store/dashboard/profile";
import ProfileImage from "../../components/dashboard/profile/ProfileImage";
import ProfileForm from "../../components/dashboard/profile/ProfileForm";
import SuccessToast from "../../components/SuccessToast";
import ErrorToast from "../../components/ErrorToast";
import DashboardNavBar from "../../components/dashboard/DashboardNavBar";

export default function DashboardProfilePage() {
  const { setError, setSuccess } = useGlobalStore();
  const { setLoadingStates } = useProfileStore();

  useEffect(() => {
    return () => {
      setLoadingStates({});
      setSuccess("");
      setError("");
    };
  }, []);

  return (
    <>
      <SuccessToast />
      <ErrorToast />

      <Container fluid className="px-4 py-5 max-w-5xl">
        <h2 className="mb-2 fw-bold">Profile</h2>
        <p className="mb-5 text-body-secondary">
          Update and manage your personal information.
        </p>
        <ProfileImage />
        <ProfileForm />
      </Container>
    </>
  );
}
