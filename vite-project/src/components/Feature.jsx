import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Styles/Feature.css";

const Feature = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState(""); // State to store user's name
  const navigate = useNavigate();

  // Fetch user's name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else {
      alert("Please log in first.");
      navigate("/auth");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("userName"); // Clear username
    navigate("/auth");
  };

  const features = [
    { title: "Dashboard", icon: "fas fa-tachometer-alt" },
  ];

  return (
    <div className="feature-container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <i className="fas fa-brain"></i>
          <span>SmartPrep AI</span>
        </div>
        <ul className="sidebar-links">
          {features.map((feature, index) => (
            <li key={index}>
              <i className={feature.icon}></i> {feature.title}
            </li>
          ))}
        </ul>
        <div className="logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <nav className="navbar1">
          <div className="nav-brand">
            <i className="fas fa-brain"></i>
            <span>SmartPrep AI</span>
          </div>
          <div className="nav-links">
            <button onClick={toggleSidebar} className="nav-link">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </nav>

        <div className="main-area">
          <div className="welcome-section">
            <h1>Welcome, {userName || "Guest"}</h1> {/* Display the user's name */}
            <p>Your personalized learning assistant</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <i className="fas fa-play-circle"></i>
              <Link to="/auto-quiz">
                <button>Auto Quiz</button>
              </Link>
            </div>
            <div className="feature-card">
              <i className="fas fa-clone"></i>
              <Link to="/flash-card">
                <button>Flashcards</button>
              </Link>
            </div>
            <div className="feature-card">
              <i className="fas fa-file-pdf"></i>
              <Link to="/pdf-qa">
                <button>PDF Question Answering</button>
              </Link>
            </div>
            <div className="feature-card">
              <i className="fas fa-chart-line"></i>
              <Link to="/progress">
                <button>Progress</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
