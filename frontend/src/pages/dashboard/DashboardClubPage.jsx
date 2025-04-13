import { useEffect } from "react";
import { Container, Alert } from "react-bootstrap";
import { useClubStore } from "../../store/dashboard/club";
import { useGlobalStore } from "../../store/global";
import { useUserStore } from "../../store/user";
import { RiErrorWarningFill } from "react-icons/ri";
import ClubForm from "../../components/dashboard/club/ClubForm";
import ClubLogo from "../../components/dashboard/club/ClubLogo";
import SuccessToast from "../../components/SuccessToast";
import ErrorToast from "../../components/ErrorToast";

export default function DashboardClubPage() {
  const { setError, setSuccess } = useGlobalStore();
  const { user } = useUserStore();
  const { setLoadingStates, club } = useClubStore();

  useEffect(() => {
    return () => {
      setLoadingStates({});
      setSuccess("");
      setError("");
    };
  }, []);

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  const displayWarning = () => {
    return (
      userIsEditor() && (!club.logo_url || !club.description || !club.instagram)
    );
  };

  return (
    <>
      <SuccessToast />
      <ErrorToast />

      <Container fluid className="px-4 py-5 max-w-5xl">
        <h2 className="mb-2 fw-bold">Club</h2>
        <p className="mb-5 text-body-secondary">
          Update and manage your club's information.
        </p>
        {displayWarning() && (
          <Alert
            className="d-flex align-items-center gap-1"
            key="warning"
            variant="warning">
            <RiErrorWarningFill className="flex-shrink-0" size={24} />
            <span>
              Clubs without a <b>logo</b>, <b>description</b>, and{" "}
              <b>Instagram</b> will not be visible to visitors. Make sure to
              provide at least these details.
            </span>
          </Alert>
        )}
        <ClubLogo />
        <ClubForm />
      </Container>
    </>
  );
}
