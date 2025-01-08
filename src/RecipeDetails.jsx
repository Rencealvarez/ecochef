import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./RecipeDetails.css";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  const bucketBaseUrl =
    "https://mouumbolhqxyxfvtzgzc.supabase.co/storage/v1/object/public/recipe-images/";

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching recipe details:", error);
      } else {
        setRecipe(data);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (!recipe) {
    return <p>Loading recipe details...</p>;
  }

  return (
    <div>
      <div className="navbar">
        <div className="navbar-logo">EcoChef</div>
      </div>

      <div className="recipe-details">
        <h2>{recipe.title}</h2>
        <img
          src={bucketBaseUrl + recipe.images}
          alt={recipe.title}
          className="recipe-detail-image"
        />
        <p>
          <strong>Ingredients:</strong> {recipe.ingredients}
        </p>
        <p>
          <strong>Instructions:</strong> {recipe.instructions}
        </p>

        <button onClick={() => navigate(-1)} className="back-btn">
          Back
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;
