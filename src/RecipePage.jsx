import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./RecipePage.css";

const NavBar = ({ searchTerm, setSearchTerm, handleSearch }) => (
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
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch();
        }}
      />
    </div>
  </nav>
);

const Footer = () => (
  <footer className="footer2">
    <p>Join our listing for exclusives and new recipes</p>
    <p>&copy; 2024 EcoChef. All rights reserved.</p>
  </footer>
);

const RecipeCard = ({ id, title, imageUrl }) => {
  const bucketBaseUrl =
    "https://mouumbolhqxyxfvtzgzc.supabase.co/storage/v1/object/public/recipe-images/";

  return (
    <Link to={`/recipe-details/${id}`} className="recipe-card-link">
      <div className="recipe-card">
        <img
          src={bucketBaseUrl + imageUrl}
          alt={title}
          className="recipe-image"
        />
        <h3>{title}</h3>
      </div>
    </Link>
  );
};

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
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

    fetchRecipes();
  }, []);

  const handleSearch = () => {
    const filtered = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  return (
    <div>
      <NavBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />
      <main className="main-content">
        <section className="recipes-section">
          <h1>All Recipes</h1>
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                imageUrl={recipe.images || "placeholder-image.png"}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RecipePage;
