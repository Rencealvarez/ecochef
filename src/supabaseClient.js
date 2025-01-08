import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mouumbolhqxyxfvtzgzc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdXVtYm9saHF4eXhmdnR6Z3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NzIzMDgsImV4cCI6MjA0NDE0ODMwOH0.2BV4ia5COnDk0YOqc-jMvV6I8iCNlw5AOBh1VRvAlJM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
