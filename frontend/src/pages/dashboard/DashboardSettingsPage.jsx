import { useEffect } from "react";
import { Container } from "react-bootstrap";
import UpdatePassword from "../../components/dashboard/settings/UpdatePassword";
import { useGlobalStore } from "../../store/global";
import { useSettingsStore } from "../../store/dashboard/settings";

export default function DashboardSettingsPage() {
  const { setError, setSuccess } = useGlobalStore();
  const { setLoadingStates, setValidationErrors } = useSettingsStore();

  useEffect(() => {
    return () => {
      setLoadingStates({});
      setError("");
      setSuccess("");
      setValidationErrors([]);
    };
  }, []);

  return (
    <Container fluid className="px-4 py-5 max-w-5xl">
      <h2 className="mb-2 fw-bold">Settings</h2>
      <p className="mb-5 text-body-secondary">
        Update your account preferences and settings.
      </p>
      <UpdatePassword />
    </Container>
  );
}
