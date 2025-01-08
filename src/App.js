import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import RecipePage from "./RecipePage";
import RecipeDetails from "./RecipeDetails";
import RecipeShare from "./RecipeShare";
import AdminPage from "./AdminPage";
import ResetPasswordPage from "./ResetPasswordPage";
import "./App.css";

function App() {
  const [page, setPage] = useState("landing");

  const renderAuthPage = () => {
    switch (page) {
      case "login":
        return (
          <LoginForm
            toggleForm={() => setPage("register")}
            onLoginSuccess={() => setPage("home")}
          />
        );
      case "register":
        return <RegisterForm toggleForm={() => setPage("login")} />;
      default:
        return (
          <LandingPage
            navigateToLogin={() => setPage("login")}
            navigateToRegister={() => setPage("register")}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Router>
        {page === "landing" || page === "login" || page === "register" ? (
          renderAuthPage()
        ) : (
          <>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/recipes" element={<RecipePage />} />
              <Route path="/recipe-details/:id" element={<RecipeDetails />} />
              <Route path="/create-post" element={<RecipeShare />} />
              <Route path="/admin" element={<AdminPage />} />{" "}
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
