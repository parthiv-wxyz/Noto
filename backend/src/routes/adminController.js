export async function promoteToAdmin(req, res) {
  const { userId } = req.params;
  const supabase = req.supabase;

  const { error } = await supabase
    .from("user_roles")
    .upsert({
      user_id: userId,
      role: "admin"
    });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ message: "User promoted to admin" });
}

export async function demoteToUser(req, res) {
  const { userId } = req.params;
  const supabase = req.supabase;

  const { error } = await supabase
    .from("user_roles")
    .update({ role: "user" })
    .eq("user_id", userId);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ message: "User demoted to user" });
}
