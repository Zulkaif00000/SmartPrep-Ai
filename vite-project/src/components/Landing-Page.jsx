import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos"; // Import AOS library
import "aos/dist/aos.css"; // Import AOS CSS
import "./Styles/Landing-Page.css";
import FeatureCard from "../components/Feature-Card"; // Import FeatureCard component

const LandingPage = () => {
  const navigate = useNavigate();

  // State to track the expanded FAQ
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Customize the duration if needed
  }, []);

  // Handle the toggle of FAQ item
  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index); // Toggle the FAQ open/close
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar" data-aos="fade-down">
        <div className="navbar-left">
          <span className="logo">SmartPrep AI</span>
        </div>
        <div className="navbar-center">
          <ul className="nav-links">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#benefits">Benefits</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          <button className="signin-button" onClick={() => navigate("/auth")}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section" data-aos="fade-up">
        <h1>Study Smarter with SmartPrep AI</h1>
        <p>
          Your personalized study assistant powered by AI. Generate quizzes,
          track progress, and achieve your academic goals effortlessly.
        </p>
        <button
          className="get-started-button"
          onClick={() => navigate("/auth")}
        >
          Get Started for Free
        </button>
      </header>

      {/* Features Section */}
      <section className="features-section" id="features" data-aos="fade-right">
        <h2>Our Features</h2>
        <div className="features-container">
          <div className="feature-card">
            <img
              src="quiz5.jpg"
              alt="AI-Generated Quizzes"
              className="feature-image"
            />
            <FeatureCard
              title="AI-Generated Quizzes"
              description="Create personalized quizzes tailored to your learning pace and progress."
            />
          </div>
          <div className="feature-card">
            <img
              src="progress.jpg"
              alt="Progress Tracking"
              className="feature-image"
            />
            <FeatureCard
              title="Progress Tracking"
              description="Track your performance and identify areas for improvement."
            />
          </div>
          <div className="feature-card">
            <img
              src="integration.jpg"
              alt="Integration Tools"
              className="feature-image"
            />
            <FeatureCard
              title="Integration Tools"
              description="Convert notes from Google Docs or PDFs into study materials instantly."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section" id="benefits" data-aos="fade-left">
        <h2>Why Choose SmartPrep AI?</h2>
        <ul>
          <li>Boost productivity with AI-driven recommendations.</li>
          <li>Save time by automating study material creation.</li>
          <li>Stay organized with intuitive progress tracking tools.</li>
        </ul>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" data-aos="fade-up">
        <h2>What Our Users Say</h2>
        <div className="testimonials-container">
          <div className="testimonial">
            <img
              src="sarah.jpg"
              alt="Sarah"
              className="testimonial-image"
            />
            <p>
              "SmartPrep AI revolutionized the way I study. It's a
              game-changer!"
            </p>
            <span>- Sarah, College Student</span>
          </div>
          <div className="testimonial">
            <img
              src="mark.jpg"
              alt="Mark"
              className="testimonial-image"
            />
            <p>
              "The adaptive quizzes helped me prepare efficiently for my
              exams."
            </p>
            <span>- Mark, High School Senior</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq" data-aos="fade-up">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          <div
            className={`faq-item ${expandedFAQ === 0 ? "active" : ""}`}
            onClick={() => toggleFAQ(0)}
          >
            <h3>How does SmartPrep AI work?</h3>
            {expandedFAQ === 0 && (
              <p>
                SmartPrep AI uses advanced machine learning algorithms to
                generate personalized quizzes based on your study material and
                progress.
              </p>
            )}
          </div>
          <div
            className={`faq-item ${expandedFAQ === 1 ? "active" : ""}`}
            onClick={() => toggleFAQ(1)}
          >
            <h3>Is my data secure?</h3>
            {expandedFAQ === 1 && (
              <p>
                Yes, we use top-tier encryption to ensure the security and
                privacy of your data. We never share your personal information.
              </p>
            )}
          </div>
          <div
            className={`faq-item ${expandedFAQ === 2 ? "active" : ""}`}
            onClick={() => toggleFAQ(2)}
          >
            <h3>Can I use it on mobile devices?</h3>
            {expandedFAQ === 2 && (
              <p>
                No! SmartPrep AI is not fully responsive and works only on
                desktop.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" data-aos="fade-down">
        <p>&copy; 2024 SmartPrep AI. All Rights Reserved.</p>
        <ul>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <a href="#privacy">Privacy Policy</a>
          </li>
          <li>
            <a href="#terms">Terms of Service</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default LandingPage;
