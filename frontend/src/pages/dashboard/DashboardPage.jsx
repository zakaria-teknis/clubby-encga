import { Route, Routes, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import DashboardProfilePage from "./DashboardProfilePage";
import DashboardRequestsPage from "./DashboardRequestsPage";
import DashboardBoardPage from "./DashboardBoardPage";
import DashboardMembersPage from "./DashboardMembersPage";
import DashboardClubPage from "./DashboardClubPage";
import DashboardEventsPage from "./DashboardEventsPage";
import DashboardNavBar from "../../components/dashboard/DashboardNavBar";
import DashboardSettingsPage from "./DashboardSettingsPage";

export default function DashboardPage() {
  return (
    <Container
      fluid
      className="d-flex p-0 w-100"
      style={{ minHeight: "calc(100vh - 72px)" }}>
      <DashboardNavBar />
      <Routes>
        <Route index element={<Navigate to="profile" />} />
        <Route path="profile" element={<DashboardProfilePage />} />
        <Route path="requests" element={<DashboardRequestsPage />} />
        <Route path="board" element={<DashboardBoardPage />} />
        <Route path="members" element={<DashboardMembersPage />} />
        <Route path="club" element={<DashboardClubPage />} />
        <Route path="events" element={<DashboardEventsPage />} />
        <Route path="settings" element={<DashboardSettingsPage />} />
      </Routes>
    </Container>
  );
}
