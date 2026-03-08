import multer from "multer";
import path from "path";
import { logAudit } from "../utils/auditLogger.js";
import { validateFile } from "../utils/validators.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadMaterial = [
  upload.single("file"),
  async (req, res) => {
    const supabase = req.supabase;
    const file = req.file;
    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const mime_type = file.mimetype;
    const original_filename = file.originalname;
    const file_extension = path.extname(file.originalname);
    const file_size = file.size;

    const validation = validateFile({ file, required: true });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const { title, subject, department, course_level, year, semester, module } =
      req.body;

    const normalizedCourseLevel =
      course_level === "UG" ? "Graduate" : "Post Graduate";

    const { data: existingMaterial } = await supabase
      .from("materials")
      .select("id")
      .eq("title", title.trim())
      .eq("department", department)
      .eq("course_level", normalizedCourseLevel)
      .eq("year", Number(year))
      .eq("semester", Number(semester))
      .eq("subject", subject)
      .eq("module", Number(module))
      .maybeSingle();

    if (existingMaterial) {
      return res.status(400).json({
        message: "Material already exists",
      });
    }

    const filePath = `${req.user.id}/${Date.now()}-${req.file.originalname}`;

    const { error: storageError } = await supabase.storage
      .from("materials")
      .upload(filePath, file.buffer, {
        contentType: mime_type,
      });

    if (storageError) {
      return res.status(500).json({ message: storageError.message });
    }

    const { data, error: dbError } = await supabase
      .from("materials")
      .insert({
        title:title.trim(),
        subject,
        department,
        course_level: normalizedCourseLevel,
        year: Number(year),
        semester: Number(semester),
        module: Number(module),
        mime_type,
        original_filename,
        file_extension,
        file_size,
        file_url: filePath,
        uploader: req.user.id,
      })
      .select()
      .single();

    if (dbError) {
      console.log("DB ERROR:", dbError);
      return res.status(400).json({ message: dbError.message });
    }

    await logAudit({
      supabase: req.supabase,
      actorId: req.user.id,
      actorRole: req.userRole,
      action: "UPLOAD",
      tableName: "materials",
      recordId: data.id,
    });

    res.status(201).json({
      message: "Material uploaded successfully",
      material: data,
    });
  },
];
