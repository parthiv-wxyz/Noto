import { logAudit } from "../utils/auditLogger.js";

export async function softDeleteMaterial(req, res) {
  const { id } = req.params;
  const supabase = req.supabase;

  let query = supabase
    .from("materials")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (req.userRole === "user") {
    query = query.eq("uploader", req.user.id);
  }

  const { data, error } = await query.select().single();

  if (error || !data) {
    return res.status(403).json({
      message: "Not allowed or material not found",
    });
  }

  await logAudit({
    supabase,
    actorId: req.user.id,
    actorRole: req.userRole,
    action: "SOFT_DELETE",
    tableName: "materials",
    recordId: id,
  });

  res.json({ message: "Material soft deleted" });
}

export async function restoreMaterial(req, res) {
  const { id } = req.params;
  const supabase = req.supabase;

  let query = supabase
    .from("materials")
    .update({ deleted_at: null })
    .eq("id", id);

  if (req.userRole === "user") {
    query = query.eq("uploader", req.user.id);
  }

  const { data, error } = await query.select().single();

  if (error || !data) {
    return res.status(403).json({
      message: "Not allowed or material not found",
    });
  }

  await logAudit({
    supabase,
    actorId: req.user.id,
    actorRole: req.userRole,
    action: "RESTORE",
    tableName: "materials",
    recordId: id,
  });

  res.json({ message: "Material restored" });
}

export async function getDownloadUrl(req, res) {
  const { id } = req.params;
  const supabase = req.supabase;

  const { data: material, error } = await supabase
    .from("materials")
    .select("file_url, mime_type, original_filename, file_size, deleted_at")
    .eq("id", id)
    .single();

  if (error || !material) {
    return res.status(404).json({ message: "Material not found" });
  }

  if (material.deleted_at && req.userRole === "user") {
    return res.status(403).json({ message: "Material not available" });
  }

  const { data: signed, error: signError } = await supabase.storage
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
    recordId: id,
  });

  res.json({
    download_url: signed.signedUrl,
    filename: material.original_filename,
    mime_type: material.mime_type,
    file_size: material.file_size,
  });
}

// export async function getMaterials(req, res) {
//   const supabase = req.supabase;

//   const { department, subject, course_level, year, semester, module } =
//     req.query;

//   let query = supabase.from("materials").select("*").is("deleted_at", null);

//   if (department) query = query.eq("department", department);
//   if (subject) query = query.eq("subject", subject);
//   if (course_level) {
//     const normalizedCourseLevel =
//       course_level === "UG"
//         ? "Graduate"
//         : course_level === "PG"
//           ? "Post Graduate"
//           : course_level;

//     query = query.eq("course_level", normalizedCourseLevel);
//   }
//   if (year) query = query.eq("year", Number(year));
//   if (semester) query = query.eq("semester", Number(semester));
//   if (module) query = query.eq("module", Number(module));

//   const { data, error } = await query.order("created_at", { ascending: false });

//   if (error) {
//     return res.status(500).json({ message: error.message });
//   }

//   res.json(data);
// }

export async function getMaterials(req, res) {
  const supabase = req.supabase;

  const {
    search,
    department,
    subject,
    course_level,
    year,
    semester,
    module,
  } = req.query;

  let query = supabase
    .from("materials")
    .select("*")
    .is("deleted_at", null);

  if (department) query = query.eq("department", department);

  if (subject) query = query.eq("subject", subject);

  if (course_level) query = query.eq("course_level", course_level);

  if (year) query = query.eq("year", Number(year));

  if (semester) query = query.eq("semester", Number(semester));

  if (module) query = query.eq("module", Number(module));

  if (search) {
    query = query.or(`title.ilike.${search}%,subject.ilike.${search}%`);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
}