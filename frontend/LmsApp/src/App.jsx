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
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && location.pathname !== "/mobile-notice") {
      navigate("/mobile-notice", { replace: true });
    }
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
