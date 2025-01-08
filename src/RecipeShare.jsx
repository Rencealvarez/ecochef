import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./RecipeShare.css";

const RecipeShare = () => {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let imageUrl = "";
    if (image) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("recipe-images")
        .upload(image.name, image);

      if (uploadError) {
        console.error("Upload Error:", uploadError.message);
        alert(`Image upload failed: ${uploadError.message}`);
        return;
      }

      imageUrl = uploadData.path;
    }

    const { data, error } = await supabase.from("recipes").insert([
      {
        title: recipeTitle,
        ingredients: ingredients,
        instructions: instructions,
        images: imageUrl,
        isApproved: false,
      },
    ]);

    if (data) {
      console.log("Inserted recipe:", data);
    }
    if (error) {
      console.error("Error inserting recipe:", error);
      alert(`Recipe submission failed: ${error.message}`);
    } else {
      alert(
        `Recipe: ${recipeTitle} has been submitted and is awaiting approval.`
      );
      navigate("/");
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-logo">EcoChef</div>
      </div>
      <div className="form-wrapper">
        <h1 className="form-title">Share Your Recipe to the World!</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recipeTitle">Recipe Title</label>
            <input
              type="text"
              id="recipeTitle"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              placeholder="Enter the title of your recipe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredients</label>
            <input
              type="text"
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="List the ingredients"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Instructions</label>
            <input
              type="text"
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Describe the steps to prepare"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="uploadImage">Upload Image</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="file"
                id="uploadImage"
                onChange={handleImageUpload}
                required
              />
              <i className="fas fa-image upload-icon"></i>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipeShare;
