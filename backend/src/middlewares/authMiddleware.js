import { createClient } from "@supabase/supabase-js";

// Admin client — created once at module load, never exposed to users
// Service role bypasses RLS so user_roles lookup always works
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing Token" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // Per-request user client — used for RLS-respecting queries elsewhere
  const supabaseUser = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );

  const { data: authData, error: authError } = await supabaseUser.auth.getUser();

  if (authError || !authData?.user) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  req.user = authData.user;
  req.supabase = supabaseUser;

  // Use admin client to look up role — bypasses RLS, no false negatives
  const { data: roleRow } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", authData.user.id)
    .maybeSingle(); // maybeSingle: returns null (not error) when no row found

  req.userRole = roleRow?.role ?? "user";

  next();
}