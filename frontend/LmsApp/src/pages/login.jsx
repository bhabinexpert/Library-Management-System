import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login-Signup.css";


export function Login() {
  const [email, setEmail] = useState("");              // User email input
  const [password, setPassword] = useState("");        // User password input
  const [dialogMessage, setDialogMessage] = useState("");  // Custom alert message
  const [loading, setLoading] = useState(false);       // Show loader while waiting
  const navigate = useNavigate();                      // For redirecting users

  // 🧠 Shows a custom dialog message instead of default `alert()`
  const showDialog = (message) => {
    setDialogMessage(message);
    setTimeout(() => setDialogMessage(""), 3000); // Hide after 3 seconds
  };

  // 🟢 Handles form submission and login logic
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on submit

    // ✋ Basic input validation
    if (!email || !password) {
      showDialog("Email or password is missing.");
      return;
    }

    // 🧪 Validate proper email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showDialog("Invalid email address.");
      return;
    }

    try {
      setLoading(true); // Show loader during login request

      // 🔐 Send login data to backend
      const response = await axios.post("http://localhost:9000/login", {
        email,
        password,
        
      });

      // ✅ If login is successful (HTTP 200)
      if (response.status === 200) {
        const { token, user } = response.data;

        // 💾 Save token and user data to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("id", user._id);

        showDialog("Login successful!");

        // ⏳ Short delay to show message before redirecting
        setTimeout(() => {
          // 🚀 Redirect user based on their role
          if (user.role === "admin") {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/home');
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      console.log(error)
      // 🔴 Show custom error message
      showDialog(
        error.response?.data?.message || "Login failed. Please try again."
        
      );
    } finally {
      setLoading(false); // Hide loader after login completes
    }
  };

  // 🔁 Auto-login: Verifies existing token on first page load
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true); // Show loader during token verification

      // 🔎 Request backend to verify the JWT token
      const response = await axios.get("http://localhost:9000/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ If token is valid, auto-redirect user to dashboard
      if (response.status === 200 && response.data.user) {
        const { role, fullName } = response.data.user;
       

        if (role === "admin") {
          navigate('/admin/dashboard');
          
        } else {
          navigate('user/home');
        }
      }
    } catch (error) {
      console.log("Token verify error:", error);

      // ❌ If token is invalid, clear all local data
      if (error.response && error.response.status === 400) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("id");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🧠 useEffect runs `verifyToken` once when the page loads
  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <>
      {/* Loader Spinner */}
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      {/* Main Login UI */}
      {!loading && (
        <div className="body">
          <div className="login-card">
            <div className="top-section">
              <h2>Welcome Back 👋</h2>
              <p>Please log in to your account</p>
            </div>

            {/* 📢 Custom Dialog Message */}
            {dialogMessage && <div className="dialog">{dialogMessage}</div>}

            {/* 📝 Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="email-container">
                <label className="email">Email Address</label>
                <input
                  placeholder="you@example.com"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="password-container">
                <label className="password">Password</label>
                <input
                  placeholder="********"
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="login">
                <button className="loginbtn" type="submit">
                  Login
                </button>
              </div>
            </form>

            {/* 🔗 Signup Redirect */}
            <h4>Don't have an account?</h4>
            <p className="signupbtn">
              <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
