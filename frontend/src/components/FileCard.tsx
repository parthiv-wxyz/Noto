import { useState } from "react";
import type { Material } from "../utils/types/material";
import api from "../services/api";

type FileCardProps = {
  material: Material;
};

function FileCard({ material }: FileCardProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/material/${material.id}/download`);
      window.open(res.data.download_url, "_blank");
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ border: "1px solid gray", padding: "12px", marginBottom: "12px" }}>
      <h3>{material.title}</h3>
      <p>Department: {material.department}</p>
      <p>Subject: {material.subject}</p>
      <p>Semester: {material.semester}</p>
      <p>Module: {material.module}</p>
      <p>File: {material.original_filename} ({formatSize(material.file_size)})</p>
      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Getting link…" : "Download"}
      </button>
    </div>
  );
}

export default FileCard;