import dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";
console.log("SUPABASE_URL =", process.env.SUPABASE_URL);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const { data, error } = await supabase.auth.signInWithPassword({
  email: "pparthivprakash1@gmail.com",
  password: "6911",
});

if (error) {
  console.error(error);
} else {
  console.log("JWT:", data.session.access_token);
}
