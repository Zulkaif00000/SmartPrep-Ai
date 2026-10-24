import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Menu,
  LayoutDashboard,
  LogOut,
  ListChecks,
  Layers,
  FileText,
  LineChart,
} from "lucide-react";
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
    { title: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className="feature-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <span className="feature-brand__mark" aria-hidden="true">
            <Sparkles size={15} strokeWidth={2.4} />
          </span>
          <span>smartprep<span className="feature-brand__ai">.ai</span></span>
        </div>
        <ul className="sidebar-links">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <li key={index}>
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                <span>{feature.title}</span>
              </li>
            );
          })}
        </ul>
        <div
          className="logout"
          onClick={handleLogout}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleLogout();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <LogOut size={16} strokeWidth={2.2} aria-hidden="true" />
          Logout
        </div>
      </aside>

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <header className="navbar1">
          <div className="nav-brand">
            <span className="feature-brand__mark" aria-hidden="true">
              <Sparkles size={15} strokeWidth={2.4} />
            </span>
            <span>smartprep<span className="feature-brand__ai">.ai</span></span>
          </div>
          <div className="nav-links">
            <button
              type="button"
              onClick={toggleSidebar}
              className="nav-link"
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
              aria-expanded={isSidebarOpen}
            >
              <Menu size={20} strokeWidth={2.2} />
            </button>
          </div>
        </header>

        <main className="main-area">
          <section className="welcome-section" aria-labelledby="feature-welcome-title">
            <span className="feature-eyebrow">YOUR STUDY SPACE</span>
            <h1 id="feature-welcome-title">Welcome, {userName || "Guest"}</h1>
            <p>Your personalized learning assistant</p>
          </section>

          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-card__icon" aria-hidden="true">
                <ListChecks size={28} strokeWidth={2} />
              </span>
              <h2 className="feature-card__title">Auto Quiz</h2>
              <p className="feature-card__desc">Generate focused practice questions on any topic.</p>
              <Link to="/auto-quiz">
                <button type="button">Auto Quiz</button>
              </Link>
            </div>
            <div className="feature-card">
              <span className="feature-card__icon" aria-hidden="true">
                <Layers size={28} strokeWidth={2} />
              </span>
              <h2 className="feature-card__title">Flashcards</h2>
              <p className="feature-card__desc">Turn key ideas into cards you can review quickly.</p>
              <Link to="/flash-card">
                <button type="button">Flashcards</button>
              </Link>
            </div>
            <div className="feature-card">
              <span className="feature-card__icon" aria-hidden="true">
                <FileText size={28} strokeWidth={2} />
              </span>
              <h2 className="feature-card__title">PDF Q&amp;A</h2>
              <p className="feature-card__desc">Ask questions and get answers from your own notes.</p>
              <Link to="/pdf-qa">
                <button type="button">PDF Question Answering</button>
              </Link>
            </div>
            <div className="feature-card">
              <span className="feature-card__icon" aria-hidden="true">
                <LineChart size={28} strokeWidth={2} />
              </span>
              <h2 className="feature-card__title">Progress</h2>
              <p className="feature-card__desc">See how your study habits are adding up over time.</p>
              <Link to="/progress">
                <button type="button">Progress</button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Feature;
