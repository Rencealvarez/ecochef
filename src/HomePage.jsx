import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import { supabase } from "./supabaseClient";

const NavBar = ({ handleSearchChange, handleLogout }) => {
  return (
    <nav className="navbar">
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
      <div className="search-bar">
        <input type="text" placeholder="Search" onChange={handleSearchChange} />
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="footer1">
      <p>Join our listing for exclusives and new recipes</p>
      <p>&copy; 2024 EcoChef. All rights reserved.</p>
    </footer>
  );
};

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const fetchRecipes = async () => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("isApproved", true);

    if (error) {
      console.error("Error fetching recipes:", error);
    } else {
      setRecipes(data);
      setFilteredRecipes(data);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();

    if (query) {
      const filtered = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query)
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error);
    else window.location.reload();
  };

  return (
    <div>
      <NavBar
        handleSearchChange={handleSearchChange}
        handleLogout={handleLogout}
      />
      <div className="create-post">
        <Link to="/create-post">
          <button>Create new post +</button>
        </Link>
      </div>

      <main className="homepage-main">
        <section className="recipe-feed">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                title={recipe.title}
                id={recipe.id}
                imageUrl={recipe.images || "https://via.placeholder.com/150"}
              />
            ))
          ) : (
            <p>No recipes found.</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
