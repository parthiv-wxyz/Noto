import multer from "multer";
import path from "path";
import { logAudit } from "../utils/auditLogger.js";
import { validateFile } from "../utils/validators.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadUpdate = [
  upload.single("file"),
  async (req, res) => {
    const supabase = req.supabase;
    const file = req.file;

    const validation = validateFile({ file, required: false });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    let fileData = {};

    if (file) {
      const mime_type = file.mimetype;
      const original_filename = file.originalname;
      const file_extension = path.extname(file.originalname);
      const file_size = file.size;

      const file_category = mime_type.startsWith("image/") ? "IMAGE" : "FILE";

      const filePath = `updates/${
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

      fileData = {
        mime_type,
        original_filename,
        file_extension,
        file_size,
        file_url: filePath,
      };
    }

    const { title, description } = req.body;

    const { data, error } = await supabase
      .from("updates")
      .insert({
        title,
        description,
        ...fileData,
        uploader: req.user.id,
      })
      .select()
      .single();

    if (error) {
      return res.status(403).json({ message: error.message });
    }

    await logAudit({
      supabase,
      actorId: req.user.id,
      actorRole: req.userRole,
      action: "UPLOAD",
      tableName: "updates",
      recordId: data.id,
    });

    res.status(201).json({
      message: "Update posted",
      update: data,
    });
  },
];

export async function getUpdateDwldUrl(req, res) {
  const { id } = req.params;
  const supabase = req.supabase;

  const { data, error } = await supabase
    .from("updates")
    .select("file_url, mime_type, original_filename, file_size")
    .eq("id", id)
    .single();

  if (error || !data || !data.file_url) {
    return res.status(404).json({ message: "File not found" });
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
    tableName: "updates",
    recordId: id,
  });

  res.json({
    download_url: signed.signedUrl,
    filename: data.original_filename,
    mime_type: data.mime_type,
    file_size: data.file_size,
  });
}
