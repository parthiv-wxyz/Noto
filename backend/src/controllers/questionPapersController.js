import multer from "multer";
import path from "path";
import { logAudit } from "../utils/auditLogger.js";
import { validateFile } from "../utils/validators.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadQP = [
  upload.single("file"),
  async (req, res) => {
    const supabase = req.supabase;

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "File required" });
    }

    const mime_type = file.mimetype;
    const original_filename = file.originalname;
    const file_extension = path.extname(file.originalname);
    const file_size = file.size;

    const validation = validateFile({
      file: req.file,
      required: true,
    });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const { title, subject, course_level, year, semester, exam_type } =
      req.body;

    const filePath = `questionpapers/${
      req.user.id
    }/${Date.now()}-${original_filename}`;

    const { error: storageError } = await supabase.storage
      .from("materials")
      .upload(filePath, file.buffer, {
        contentType: mime_type,
      });

    if (storageError) {
      return res.status(500).json({ message: storageError.message });
    }

    const { data, error: dbError } = await supabase
      .from("question_papers")
      .insert({
        title,
        subject,
        course_level,
        year,
        semester,
        exam_type,
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
      return res.status(403).json({ message: dbError.message });
    }

    await logAudit({
      supabase,
      actorId: req.user.id,
      actorRole: req.userRole,
      action: "UPLOAD",
      tableName: "questionpapers",
      recordId: data.id,
    });

    res.status(201).json({
      message: "Question paper uploaded",
      questionPaper: data,
    });
  },
];

export async function getQPDwldUrl(req, res) {
  const { id } = req.params;
  const supabase = req.supabase;

  const { data, error } = await supabase
    .from("question_papers")
    .select("file_url, mime_type, original_filename, file_size")
    .eq("id", id)
    .single();

  if (error || !data) {
    return res.status(404).json({ message: "Question paper not found" });
  }

  const { data: signed, error: signError } = await supabase.storage
    .from("materials")
    .createSignedUrl(data.file_url, 600);

  if (signError) {
    return res.status(500).json({ message: signError.message });
  }

  await logAudit({
    supabase,
    actorId: req.user.id,
    actorRole: req.userRole,
    action: "DOWNLOAD",
    tableName: "questionpapers",
    recordId: id,
  });

  res.json({
  download_url: signed.signedUrl,
  filename: data.original_filename,
  mime_type: data.mime_type,
  file_size: data.file_size,
});

}
