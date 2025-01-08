import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./RecipeCard.css";

const RecipeCard = ({
  id,
  title,
  description,
  instructions,
  imageUrl,
  userId,
}) => {
  const bucketBaseUrl =
    "https://mouumbolhqxyxfvtzgzc.supabase.co/storage/v1/object/public/recipe-images/";

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userInteraction, setUserInteraction] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountsAndInteraction = async () => {
      try {
        const { data: recipeData, error: recipeError } = await supabase
          .from("recipes")
          .select("likes, dislikes")
          .eq("id", id)
          .single();

        if (recipeError) throw recipeError;

        setLikeCount(recipeData.likes || 0);
        setDislikeCount(recipeData.dislikes || 0);

        if (userId) {
          const { data: interactionData, error: interactionError } =
            await supabase
              .from("recipe_interactions")
              .select("liked")
              .eq("user_id", userId)
              .eq("recipe_id", id)
              .single();

          if (interactionError && interactionError.code !== "PGRST116") {
            throw interactionError;
          }
          setUserInteraction(interactionData ? interactionData.liked : null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCountsAndInteraction();
  }, [id, userId]);

  const handleLike = async () => {
    if (userInteraction === true) return;

    try {
      const newLikeCount = likeCount + 1;
      const newDislikeCount =
        userInteraction === false ? dislikeCount - 1 : dislikeCount;

      setLikeCount(newLikeCount);
      if (userInteraction === false) setDislikeCount(newDislikeCount);

      await supabase
        .from("recipes")
        .update({ likes: newLikeCount, dislikes: newDislikeCount })
        .eq("id", id);

      await supabase.from("recipe_interactions").upsert({
        user_id: userId,
        recipe_id: id,
        liked: true,
      });

      setUserInteraction(true);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleDislike = async () => {
    if (userInteraction === false) return;

    try {
      const newDislikeCount = dislikeCount + 1;
      const newLikeCount = userInteraction === true ? likeCount - 1 : likeCount;

      setDislikeCount(newDislikeCount);
      if (userInteraction === true) setLikeCount(newLikeCount);

      await supabase
        .from("recipes")
        .update({ likes: newLikeCount, dislikes: newDislikeCount })
        .eq("id", id);

      await supabase.from("recipe_interactions").upsert({
        user_id: userId,
        recipe_id: id,
        liked: false,
      });

      setUserInteraction(false);
    } catch (error) {
      console.error("Error updating dislike:", error);
    }
  };

  return (
    <div className="recipe-card">
      <img
        src={bucketBaseUrl + imageUrl}
        alt={title}
        className="recipe-image1"
      />
      <div className="recipe-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <p>{instructions}</p>
        <div className="card-actions">
          <button
            onClick={() => navigate(`/recipe-details/${id}`)}
            className="details-btn"
          >
            Details
          </button>
          <button
            onClick={handleLike}
            className={`like-btn ${userInteraction === true ? "active" : ""}`}
          >
            ❤️ {likeCount}
          </button>
          <button
            onClick={handleDislike}
            className={`dislike-btn ${
              userInteraction === false ? "active" : ""
            }`}
          >
            👎 {dislikeCount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
