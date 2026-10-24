import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import "./Styles/FYP.css";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/users/forgot-password`, {
        email,
        newPassword,
      });

      if (response.data.success) {
        alert("Password reset successfully. Please log in with your new password.");
        navigate("/"); // Redirect to login
      } else {
        alert(response.data.message || "Error resetting password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error.message);
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="forgot-password">
      <header className="fyp-header">
        <Link to="/" className="fyp-brand" aria-label="SmartPrep AI home">
          <span className="fyp-brand__mark"><Sparkles size={15} strokeWidth={2.4} /></span>
          <span>smartprep<span className="fyp-brand__ai">.ai</span></span>
        </Link>
        <Link to="/auth" className="fyp-back-link">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </header>

      <form onSubmit={handleForgotPassword} className="fyp-card">
        <span className="fyp-eyebrow">ACCOUNT</span>
        <h1>Forgot Password</h1>
        <p className="fyp-kicker">Choose a new password and get back to your study space.</p>
        <label className="fyp-field-label" htmlFor="fyp-email">Email address</label>
        <input
          id="fyp-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="fyp-field-label" htmlFor="fyp-new-password">New password</label>
        <input
          id="fyp-new-password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label className="fyp-field-label" htmlFor="fyp-confirm-password">Confirm new password</label>
        <input
          id="fyp-confirm-password"
          type="password"
          placeholder="Confirm new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="fyp-submit">
          Reset Password <ArrowRight size={15} />
        </button>
        <p className="fyp-footnote">You’ll use this password the next time you sign in.</p>
      </form>
    </div>
  );
}

export default ForgotPassword;
