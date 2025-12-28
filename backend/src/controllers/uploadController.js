import multer from "multer";
import { logAudit } from "../utils/auditLogger.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadMaterial = [
  upload.single("file"),
  async (req, res) => {
    const supabase = req.supabase;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const { title, subject, course_level, year, semester, module, type } =
      req.body;

    const filePath = `${req.user.id}/${Date.now()}-${req.file.originalname}`;

    const { error: storageError } = await supabase.storage
      .from("materials")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (storageError) {
      return res.status(500).json({ message: storageError.message });
    }

    const { data, error: dbError } = await supabase
      .from("materials")
      .insert({
        title,
        subject,
        course_level,
        year,
        semester,
        module,
        type,
        file_url: filePath,
        uploader: req.user.id,
      })
      .select()
      .single();

    if (dbError) {
      return res.status(403).json({ message: dbError.message });
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
