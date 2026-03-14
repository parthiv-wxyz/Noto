import type { Material } from "../utils/types/material";

type FileCardProps = {
  material: Material;
};

function FileCard({ material }: FileCardProps) {
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "12px",
        marginBottom: "12px",
      }}
    >
      <h3>{material.title}</h3>
      <p>Department: {material.department}</p>
      <p>Subject: {material.subject}</p>
      <p>Semester: {material.semester}</p>
      <p>Module: {material.module}</p>

      <a
        href={material.file_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        View File
      </a>
    </div>
  );
}

export default FileCard;