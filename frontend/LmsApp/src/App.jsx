import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landing.jsx";
import { Login } from "./pages/login.jsx";
import { Signup } from "./pages/signup.jsx";
import Contact from "./pages/contact.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import AdminDashboard from "./pages/admin/admin.jsx";
import UserDashboard from "./pages/user/user.jsx";
import MobileNotice from "./pages/mobile-notice.jsx";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Function to check and redirect based on window size
    const handleResize = () => {
      const isMobileScreen = window.innerWidth <= 768;
      if (isMobileScreen && location.pathname !== "/mobile-notice") {
        navigate("/mobile-notice", { replace: true });
      } else if (!isMobileScreen && location.pathname === "/mobile-notice") {
        window.location.href = "/"; // Refresh to main site
      }
    };

    // Initial check
    handleResize();
    // Listen for resize events
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/user/home/" element={<UserDashboard />} />
        <Route path="/mobile-notice" element={<MobileNotice />} />
      </Routes>
    </>
  );
}

export default App;
