import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import "./AdminPage.css";

const AdminPage = () => {
  const [unapprovedRecipes, setUnapprovedRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnapprovedRecipes = async () => {
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("isApproved", false);

        if (error) throw error;
        setUnapprovedRecipes(data || []);
      } catch (error) {
        console.error("Error fetching recipes:", error.message);
        alert("Could not fetch recipes.");
      }
    };

    fetchUnapprovedRecipes();
  }, []);

  const handleApprove = async (recipeId) => {
    try {
      const { error } = await supabase
        .from("recipes")
        .update({ isApproved: true })
        .eq("id", recipeId);

      if (error) throw error;
      setUnapprovedRecipes((prev) =>
        prev.filter((recipe) => recipe.id !== recipeId)
      );
    } catch (error) {
      console.error("Error approving recipe:", error.message);
      alert("Failed to approve recipe.");
    }
  };

  const handleReject = async (recipeId) => {
    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeId);

      if (error) throw error;
      setUnapprovedRecipes((prev) =>
        prev.filter((recipe) => recipe.id !== recipeId)
      );
    } catch (error) {
      console.error("Error rejecting recipe:", error.message);
      alert("Failed to reject recipe.");
    }
  };

  return (
    <div>
      <div className="navbar">
        <h1>EcoChef Administration</h1>
      </div>
      <div className="main-content">
        <h2>Admin Approval</h2>
        {unapprovedRecipes.length > 0 ? (
          unapprovedRecipes.map((recipe) => (
            <div key={recipe.id} className="cards">
              <RecipeCard
                title={recipe.title}
                id={recipe.id}
                imageUrl={recipe.images || "https://via.placeholder.com/150"}
              />
              <button
                onClick={() => handleApprove(recipe.id)}
                className="approve-btn"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(recipe.id)}
                className="reject-btn"
              >
                Reject
              </button>
            </div>
          ))
        ) : (
          <p>No recipes awaiting approval.</p>
        )}
        <button className="backk-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
