const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const multer = require("multer");
const cors = require("cors");

const app = express();
const port = 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/api/recipes", async (req, res) => {
  try {
    const { data, error } = await supabase.rpc("get_approved_recipes");

    if (error) {
      console.error("Error fetching recipes:", error);
      return res.status(500).json({ error: "Failed to fetch recipes" });
    }

    console.log("CALL get_approved_recipes();");

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//recipes
app.post("/api/recipes", upload.single("image"), async (req, res) => {
  const { title, ingredients, instructions } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).json({ error: "Image is required" });
  }

  try {
    // Upload image to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("recipe-images")
      .upload(image.originalname, image.buffer);

    if (uploadError) {
      return res.status(500).json({ error: `Image upload failed: ${uploadError.message}` });
    }

    const imageUrl = uploadData.path;

  
    const insertQuery = `
      INSERT INTO recipes (title, ingredients, instructions, images, isApproved)
      VALUES ('${title}', '${ingredients}', '${instructions}', '${imageUrl}', false);
    `;

    // Perform the SQL query directly
    const { data, error } = await supabase.rpc('exec_sql', {
      query: insertQuery
    });

    if (error) {
      return res.status(500).json({ error: `Recipe submission failed: ${error.message}` });
    }

    res.status(201).json(data); // Return the inserted recipe data
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


//login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
      return res.status(401).json({ error: error.message });
    }

    console.log(
      `SELECT * FROM auth.users WHERE email = '${email}' AND password = '[REDACTED]';`
    );

    res.json({ message: "Login successful", user: data.user });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//register
app.post("/api/register", async (req, res) => {
  const { email, password, DisplayName } = req.body;

  if (!DisplayName) {
    return res.status(400).json({ error: "Display Name is required!" });
  }

  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { DisplayName },
      },
    });

    if (error) {
      console.error("Error registering user:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log(
      `INSERT INTO auth.users (email, password) VALUES ('${email}', '[REDACTED]');`
    );

    const { data: userData, error: insertError } = await supabase
      .from("users")
      .insert([{ id: user.id, DisplayName, email }]);

    if (insertError) {
      console.error("Error inserting user metadata:", insertError);
      return res.status(500).json({ error: "Failed to store user metadata" });
    }

    console.log(`INSERT INTO users (id, DisplayName, email) 
                 VALUES ('${user.id}', '${DisplayName}', '${email}');`);

    res
      .status(201)
      .json({ message: "Registration successful", user: userData });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//unapproved recipe
app.get("/api/unapproved-recipes", async (req, res) => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("isApproved", false);

  if (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ error: "Failed to fetch recipes." });
  }

  console.log("SELECT * FROM recipes WHERE isApproved = false;");

  res.json(data);
});

//Approve recipe
app.patch("/api/approve-recipe/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("recipes")
    .update({ isApproved: true })
    .eq("id", id);

  if (error) {
    console.error("Error approving recipe:", error);
    return res.status(500).json({ error: "Failed to approve recipe." });
  }

  console.log(`UPDATE recipes SET isApproved = true WHERE id = '${id}';`);

  res.json({ message: "Recipe approved successfully." });
});

// Reject recipe
app.delete("/api/reject-recipe/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) {
    console.error("Error rejecting recipe:", error);
    return res.status(500).json({ error: "Failed to reject recipe." });
  }

  console.log(`DELETE FROM recipes WHERE id = '${id}';`);

  res.json({ message: "Recipe rejected successfully." });
});

// Recipe Details
app.get("/api/recipes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();

    console.log(`SELECT * FROM recipes WHERE id = '${id}';`);

    if (error) {
      console.error("Error fetching recipe details:", error);
      return res.status(500).json({ error: "Failed to fetch recipe details" });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Recipe Card
app.get("/api/recipes/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  try {
    const { data: recipeData, error: recipeError } = await supabase
      .from("recipes")
      .select("likes, dislikes")
      .eq("id", id)
      .single();


    console.log(`SELECT likes, dislikes FROM recipes WHERE id = '${id}';`);

    if (recipeError) {
      throw recipeError;
    }


    let userInteraction = null;
    if (userId) {
      const { data: interactionData, error: interactionError } = await supabase
        .from("recipe_interactions")
        .select("liked")
        .eq("user_id", userId)
        .eq("recipe_id", id)
        .single();


      console.log(
        `SELECT liked FROM recipe_interactions WHERE user_id = '${userId}' AND recipe_id = '${id}';`
      );

      if (interactionError && interactionError.code !== "PGRST116") {
        throw interactionError;
      }

      userInteraction = interactionData ? interactionData.liked : null;
    }

    res.json({ ...recipeData, userInteraction });
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
});

//  Like 
app.post("/api/recipes/:id/like", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {

    const { data: recipeData, error: recipeError } = await supabase
      .from("recipes")
      .select("likes, dislikes")
      .eq("id", id)
      .single();

    if (recipeError) throw recipeError;


    const newLikeCount = recipeData.likes + 1;
    const newDislikeCount = recipeData.dislikes - (recipeData.userInteraction === false ? 1 : 0);


    await supabase
      .from("recipes")
      .update({ likes: newLikeCount, dislikes: newDislikeCount })
      .eq("id", id);


    console.log(
      `UPDATE recipes SET likes = ${newLikeCount}, dislikes = ${newDislikeCount} WHERE id = '${id}';`
    );


    await supabase.from("recipe_interactions").upsert({
      user_id: userId,
      recipe_id: id,
      liked: true,
    });


    console.log(
      `UPSERT INTO recipe_interactions (user_id, recipe_id, liked) VALUES ('${userId}', '${id}', true);`
    );

    res.json({ message: "Recipe liked successfully", likes: newLikeCount });
  } catch (error) {
    console.error("Error liking recipe:", error);
    res.status(500).json({ error: "Failed to like recipe" });
  }
});

// dislike
app.post("/api/recipes/:id/dislike", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {

    const { data: recipeData, error: recipeError } = await supabase
      .from("recipes")
      .select("likes, dislikes")
      .eq("id", id)
      .single();

    if (recipeError) throw recipeError;


    const newDislikeCount = recipeData.dislikes + 1;
    const newLikeCount = recipeData.likes - (recipeData.userInteraction === true ? 1 : 0);


    await supabase
      .from("recipes")
      .update({ likes: newLikeCount, dislikes: newDislikeCount })
      .eq("id", id);

 
    console.log(
      `UPDATE recipes SET likes = ${newLikeCount}, dislikes = ${newDislikeCount} WHERE id = '${id}';`
    );

    await supabase.from("recipe_interactions").upsert({
      user_id: userId,
      recipe_id: id,
      liked: false,
    });


    console.log(
      `UPSERT INTO recipe_interactions (user_id, recipe_id, liked) VALUES ('${userId}', '${id}', false);`
    );

    res.json({ message: "Recipe disliked successfully", dislikes: newDislikeCount });
  } catch (error) {
    console.error("Error disliking recipe:", error);
    res.status(500).json({ error: "Failed to dislike recipe" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
