import { useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "./store/user";
import NavBar from "./components/NavBar";
import RequestSignupPage from "./pages/home/RequestSignupPage";
import SignupPage from "./pages/home/SignupPage";
import LoginPage from "./pages/home/LoginPage";
import HomePage from "./pages/home/HomePage";
import GeneralErrorPage from "./pages/error/GeneralErrorPage";
import ExpiredSignupLinkErrorPage from "./pages/error/ExpiredSignupLinkErrorPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ClubsPage from "./pages/clubs/ClubsPage";
import ClubPage from "./pages/clubs/ClubPage";
import EventPage from "./pages/events/EventPage";
import PageNotFoundErrorPage from "./pages/error/PageNotFoundErrorPage";
import EventsPage from "./pages/events/EventsPage";
import Footer from "./components/Footer";
import ContactPage from "./pages/contact/ContactPage";

function App() {
  const { user, getUser } = useUserStore();

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [getUser]);

  const location = useLocation();
  const isSignupRoute = location.pathname.startsWith("/signup");
  const params = new URLSearchParams(location.search);
  const signupToken = params.get("signupToken");

  if (isSignupRoute && !signupToken) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <NavBar />
      <Routes>
        {/*home routes*/}
        <Route path="/" element={<HomePage />} />
        <Route path="/request-signup" element={<RequestSignupPage />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <SignupPage />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
        />

        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/clubs/:clubName" element={<ClubPage />} />

        <Route path="/events" element={<EventsPage />} />
        <Route
          path="/events/:clubName/:eventNameSlug"
          element={<EventPage />}
        />

        <Route path="/contact" element={<ContactPage />} />

        {/*dashboard route*/}
        <Route
          path="/dashboard/*"
          element={user ? <DashboardPage /> : <Navigate to="/login" />}
        />

        {/*error routes*/}
        <Route
          path="/error/expired-signup-link"
          element={<ExpiredSignupLinkErrorPage />}
        />
        <Route path="/error/general" element={<GeneralErrorPage />} />
        <Route
          path="/error/page-not-found"
          element={<PageNotFoundErrorPage />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
