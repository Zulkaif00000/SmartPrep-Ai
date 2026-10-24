import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Axios for API calls
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
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
      <header className="auth-header">
        <Link to="/" className="auth-brand" aria-label="SmartPrep AI home">
          <span className="auth-brand__mark"><Sparkles size={15} strokeWidth={2.4} /></span>
          <span>smartprep<span className="auth-brand__ai">.ai</span></span>
        </Link>
        <Link to="/" className="auth-back-link"><ArrowLeft size={14} /> Back to home</Link>
      </header>
      <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>
        {/* Sign-Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <p className="auth-form-kicker">A better way to make every study session count.</p>
            <label className="auth-field-label" htmlFor="signup-name">Your name</label>
            <input
              id="signup-name"
              type="text"
              name="username"
              placeholder="Enter your name"
              value={signUpData.username}
              onChange={(e) => handleInputChange(e, "signup")}
              required
            />
            <label className="auth-field-label" htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={signUpData.email}
              onChange={(e) => handleInputChange(e, "signup")}
              required
            />
            <label className="auth-field-label" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={signUpData.password}
              onChange={(e) => handleInputChange(e, "signup")}
              required
            />
            <button className="auth-submit" type="submit">Create account <ArrowRight size={15} /></button>
            <p className="auth-form-footnote">Your learning journey, all in one place.</p>
          </form>
        </div>

        {/* Sign-In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Welcome back.</h1>
            <p className="auth-form-kicker">Pick up where your learning left off.</p>
            <label className="auth-field-label" htmlFor="signin-email">Email address</label>
            <input
              id="signin-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={signInData.email}
              onChange={(e) => handleInputChange(e, "signin")}
              required
            />
            <label className="auth-field-label" htmlFor="signin-password">Password</label>
            <input
              id="signin-password"
              type="password"
              name="password"
              placeholder="Enter your password"
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
              className="auth-forgot-link"
            >
              Forgot password?
            </a>
            <button className="auth-submit" type="submit">Sign in <ArrowRight size={15} /></button>
            <p className="auth-form-footnote">Small steps today. Big progress tomorrow.</p>
          </form>
        </div>

        {/* Toggle Panels */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <span className="auth-panel-icon"><Sparkles size={20} /></span>
              <span className="auth-panel-eyebrow">YOUR STUDY SPACE</span>
              <h2>Good to have you back.</h2>
              <p>Sign in and keep building on everything you’ve learned.</p>
              <button type="button" onClick={handleToggle}>Sign in <ArrowRight size={14} /></button>
            </div>
            <div className="toggle-panel toggle-right">
              <span className="auth-panel-icon"><Sparkles size={20} /></span>
              <span className="auth-panel-eyebrow">LEARN A LITTLE BETTER</span>
              <h2>Your next study session starts here.</h2>
              <p>Make space for focused practice, smarter notes, and progress you can feel.</p>
              <button type="button" onClick={handleToggle}>Create account <ArrowRight size={14} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;