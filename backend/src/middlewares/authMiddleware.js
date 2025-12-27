import { getSupabase } from "../config/supabase.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing Token" });

  const token = authHeader.replace("Bearer ", "");

  const { data, error } = await getSupabase.auth.getUser(token);

  if (error || !data?.user)
    return res.status(401).json({ message: "Invalid Token" });

  req.user = data.user;

  const { data: roleRow } = await getSupabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .single();

  req.userRole = roleRow?.role || "user";

  next();
}
