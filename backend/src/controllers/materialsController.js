export async function deleteMaterial(req, res) {
  const materialId = req.params.id;
  const user = req.user;
  const role = req.userRole;

  const { data: material } = await supabase
    .from("materials")
    .select("*")
    .eq("id", materialId)
    .single();

  const { error } = await supabase
    .from("materials")
    .delete()
    .eq("id", materialId);

  if (error) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    actor_role: role,
    action: "DELETE",
    table_name: "materials",
    record_id: materialId,
    old_data: material
  });

  res.json({ message: "Material deleted" });
}
