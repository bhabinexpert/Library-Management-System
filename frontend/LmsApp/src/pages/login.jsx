import { useState } from "react";
import "./login-Signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email or password is missing");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email address");
      return;
    }
    try {
      const response = await axios.post("http://localhost:9000/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      alert("Login sucessfull!");
      
      // Redirect based on role
      if (response.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
      
    } catch (error) {}
  };
  return (
    <>
      <div className="body">
        <div className="login-card">
          <div className="top-section">
            <h2>Welcome Back 👋</h2>
            <p>Please log in to your account</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="email-container">
              <label className="email"> Email Address</label>
              <input
                placeholder="bhabindada@gmail.com"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="password-container">
              <label className="password"> Password</label>
              <input
                placeholder="**********"
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
          <h4>Don't have any Account?</h4>
          <p className="signupbtn">
            <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
