import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Styles/FYP.css";

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
      const response = await axios.post("http://localhost:5000/api/users/forgot-password", {
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
      <form onSubmit={handleForgotPassword}>
        <h1>Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
