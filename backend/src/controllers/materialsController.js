export async function softDeleteMaterial(req, res) {
  const { id } = req.params;
  const supabase = req.supabase;

  const { error } = await supabase
    .from("materials")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  await logAudit({
    supabase,
    actorId: req.user.id,
    actorRole: req.userRole,
    action: "SOFT_DELETE",
    tableName: "materials",
    recordId: id
  });

  res.json({ message: "Material soft deleted" });
}

export async function restoreMaterial(req, res) {
  const { id } = req.params;
  const supabase = req.supabase;

  const { error } = await supabase
    .from("materials")
    .update({ deleted_at: null })
    .eq("id", id);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  await logAudit({
    supabase,
    actorId: req.user.id,
    actorRole: req.userRole,
    action: "RESTORE",
    tableName: "materials",
    recordId: id
  });

  res.json({ message: "Material restored" });
}

export async function getDownloadUrl(req, res) {
  const { id } = req.params;
  const supabase = req.supabase;

  const { data: material, error } = await supabase
    .from("materials")
    .select("file_url, deleted_at")
    .eq("id", id)
    .single();

  if (error || !material) {
    return res.status(404).json({ message: "Material not found" });
  }

  if (material.deleted_at && req.userRole === "user") {
    return res.status(403).json({ message: "Material not available" });
  }

  const { data: signed, error: signError } =
    await supabase.storage
      .from("materials")
      .createSignedUrl(material.file_url, 600);

  if (signError) {
    return res.status(500).json({ message: signError.message });
  }

  await logAudit({
    supabase,
    actorId: req.user.id,
    actorRole: req.userRole,
    action: "DOWNLOAD",
    tableName: "materials",
    recordId: id
  });
  
  res.json({
    download_url: signed.signedUrl
  });
}
