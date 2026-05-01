import React from "react";
import "./Styles/Feature-Card.css";

const FeatureCard = ({ title, description }) => {
  return (
    <div className="card1" data-aos="fade-up">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="go-corner">
        <div className="go-arrow">→</div>
      </div>
    </div>
  );
};

export default FeatureCard;
