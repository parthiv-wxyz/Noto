import { createClient } from "@supabase/supabase-js";

let supabaseAdmin = null;

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing Token" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // Lazy-init admin client on first request (env vars are ready by then)
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );
  }

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

  const { data: roleRow } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  req.userRole = roleRow?.role ?? "user";
  next();
}