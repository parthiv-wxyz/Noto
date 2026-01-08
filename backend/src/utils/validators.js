export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_SIZE = 50 * 1024 * 1024;  // 50MB

export const BLOCKED_MIME_TYPES = [
  "application/x-msdownload",
  "application/x-sh",
  "application/x-bat",
  "application/x-executable",
];

export function validateFile({ file, required = true }) {
  if (!file) {
    if (required) {
      return { valid: false, message: "File is required" };
    }
    return { valid: true };
  }

  const { mimetype, size } = file;

  if (BLOCKED_MIME_TYPES.includes(mimetype)) {
    return { valid: false, message: "File type not allowed" };
  }

  if (mimetype.startsWith("image/")) {
    if (size > MAX_IMAGE_SIZE) {
      return { valid: false, message: "Image exceeds 10MB limit" };
    }
  } else {
    if (size > MAX_FILE_SIZE) {
      return { valid: false, message: "File exceeds 50MB limit" };
    }
  }

  return { valid: true };
}
