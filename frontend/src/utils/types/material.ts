export type Material = {
  id: string;
  title: string;
  department: string;
  subject: string;
  course_level: string;
  year: number;
  semester: number;
  module: number;
  file_url: string;
  mime_type: string;
  original_filename: string;
  file_size: number;
  file_extension: string;
  uploader: string;
  deleted_at: string | null;
  created_at?: string;
};