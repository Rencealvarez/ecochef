const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");

const app = express();
const port = 3000;


const supabaseUrl = "https://mouumbolhqxyxfvtzgzc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdXVtYm9saHF4eXhmdnR6Z3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NzIzMDgsImV4cCI6MjA0NDE0ODMwOH0.2BV4ia5COnDk0YOqc-jMvV6I8iCNlw5AOBh1VRvAlJM";
const supabase = createClient(supabaseUrl, supabaseKey);


app.use(cors());


app.get("/api/data", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword.select("*");
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
