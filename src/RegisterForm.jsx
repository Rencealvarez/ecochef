import React, { useState } from "react";
import "./RegisterForm.css";
import { supabase } from "./supabaseClient";

function RegisterForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!displayName) {
      setErrorMessage("Display name is required!");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Supabase error:", error);
        setErrorMessage(
          `Error: ${error.message} - ${error.details || "No details available"}`
        );
      } else {
        console.log("Registration successful:", data);
        toggleForm();
        alert("Registration successful! You can now log in.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="navbar">EcoChef</div>

      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="input"
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="toggle-text">
        Already have an account?{" "}
        <span className="toggle-link" onClick={toggleForm}>
          Login here
        </span>
      </p>
    </div>
  );
}

export default RegisterForm;
