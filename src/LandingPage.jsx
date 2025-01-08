import React from "react";
import "./LandingPage.css";

function LandingPage({ navigateToLogin }) {
  return (
    <div className="outer-container">
      <nav className="navbar">
        <span className="navbar-brand">EcoChef</span>
      </nav>

      <div className="main-container">
        <section className="welcome-section">
          <h1>
            Hey there! Welcome to <span className="brand-name">EcoChef</span>
          </h1>
          <img
            src="Food 1.jpg"
            alt="Eco-friendly food"
            className="main-image"
          />
          <p>
            This is a space to share simple, planet-friendly recipes and get new
            ideas from others. Whether you're all about reducing waste, eating
            seasonal, or just want to try something new, you're in the right
            place. Share what you've got, swap ideas, and let's keep it easy,
            green, and delicious. Glad to have you here! 🍴🌱
          </p>

          <button className="cta-button" onClick={navigateToLogin}>
            Get Started
          </button>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
