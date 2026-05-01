import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios for API calls
import "./Styles/Auth.css";

function Auth() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsRightPanelActive(!isRightPanelActive);
  };

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", signInData);
      const { token, user } = response.data;
      localStorage.setItem("token", token); // Save token in localStorage
      localStorage.setItem("userName", user.username); // Save username in localStorage
      alert("Login successful!");
      navigate("/feature"); // Navigate to a protected page
    } catch (error) {
      alert("Invalid credentials or error logging in");
      console.error(error.response?.data?.error || error.message);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/register", signUpData);
      alert("Registration successful. You can now sign in.");
      setIsRightPanelActive(false); // Switch to the sign-in panel after registration
    } catch (error) {
      alert(error.response?.data?.error || "Error registering user");
      console.error(error.response?.data?.error || error.message);
    }
  };

  // Handle Input Changes
  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "signin") {
      setSignInData({ ...signInData, [name]: value });
    } else {
      setSignUpData({ ...signUpData, [name]: value });
    }
  };

  return (
    <div className="login-page">
      <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>
        {/* Sign-Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <span>Use your email for registration</span>
            <input
              type="text"
              name="username"
              placeholder="Name"
              value={signUpData.username}
              onChange={(e) => handleInputChange(e, "signup")}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={(e) => handleInputChange(e, "signup")}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signUpData.password}
              onChange={(e) => handleInputChange(e, "signup")}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign-In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <span>Or use your email for login</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signInData.email}
              onChange={(e) => handleInputChange(e, "signin")}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signInData.password}
              onChange={(e) => handleInputChange(e, "signin")}
              required
            />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password"); // Navigate to Forgot Password page
              }}
              style={{ alignSelf: "flex-start", marginBottom: "10px" }}
            >
              <div>Forgot Your Password?</div>
            </a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Toggle Panels */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p className="welcome-back">Enter your personal details to sign in</p>
              <button onClick={handleToggle}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p className="hello-text">Register your details to start your journey with us</p>
              <button onClick={handleToggle}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;