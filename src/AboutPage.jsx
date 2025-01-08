import React from "react";
import "./AboutPage.css";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbars">
      <div className="logo">EcoChef</div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/recipes">Recipes</Link>
        </li>
      </ul>
    </nav>
  );
};

const InfoCard = ({ title, description, icon }) => (
  <div className="info-card">
    <div className="icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const AboutPage = () => {
  return (
    <div>
      <NavBar />
      <main className="about-main">
        <section className="how-it-works">
          <h2>How it works</h2>
          <div className="how-it-works-cards">
            <InfoCard
              title="Pick a meal"
              description="There are different meals to choose from."
              icon="🍽️"
            />
            <InfoCard
              title="Sharing Recipes"
              description="Share your favorite meals and ideas with your friends."
              icon="📋"
            />
            <InfoCard
              title="Cook it up"
              description="Order fresh ingredients and start cooking."
              icon="👨‍🍳"
            />
          </div>
        </section>

        <section className="purpose-section">
          <div className="purpose-content">
            <img
              src="food 3.jpg"
              alt="Roasted Chicken"
              className="purpose-image"
            />
            <div className="purpose-text">
              <h2>Purpose and Benefits</h2>
              <p>
                Choose from our variety of weekly or daily meal plans to suit
                your dietary needs, preferences, or lifestyle. Whether you're
                focused on healthy eating, weight management, or simply want to
                save time in the kitchen, our plans offer a range of delicious,
                balanced meals to keep you satisfied and on track. All meals are
                prepared fresh, with high-quality ingredients, and are carefully
                portioned for convenience. With easy-to-follow recipes and
                pre-portioned ingredients, cooking at home becomes a breeze,
                allowing you to enjoy a nutritious meal without the hassle of
                planning or prepping. Simply select your preferred meal plan,
                and let us handle the rest so you can enjoy delicious,
                home-cooked meals every day with minimal effort!
              </p>
            </div>
          </div>
        </section>

        <section className="footers" style={{ textAlign: "center" }}>
          <p>Join our listing for exclusives and new recipes</p>
          <p>&copy; 2024 EcoChef. All rights reserved.</p>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
