import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import "./RecipeFeed.css";

const RecipeFeed = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("YOUR_API_ENDPOINT");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <main className="homepage-main">
      <section className="recipe-feed">
        <h2>Recipe Feed</h2>{" "}
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              id={recipe.id}
              description={recipe.ingredients}
              instructions={recipe.instructions}
              imageUrl={recipe.images || "https://via.placeholder.com/150"}
            />
          ))
        ) : (
          <p>No recipes available.</p>
        )}
      </section>
    </main>
  );
};

export default RecipeFeed;
