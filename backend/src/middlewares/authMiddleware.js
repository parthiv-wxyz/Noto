import { createClient } from "@supabase/supabase-js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing Token" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  req.user = authData.user;
  req.supabase = supabase;

  const { data: roleRow, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  if (roleError) {
    req.userRole = "user";
  } else {
    req.userRole = roleRow.role;
  }

  next();
}
