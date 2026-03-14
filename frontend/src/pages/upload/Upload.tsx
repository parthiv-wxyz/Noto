import { useState } from "react";
import { uploadMaterial, getMaterials } from "../../services/materialService";
import "./Upload.css";
import Navbar from "../../components/navbar/Navbar";

function Upload() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [module, setModule] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const yearOptions =
    courseLevel === "UG"
      ? ["1", "2", "3", "4"]
      : courseLevel === "PG"
        ? ["1", "2"]
        : [];

  const semesterOptions =
    courseLevel === "UG"
      ? year === "1" ? ["1", "2"]
        : year === "2" ? ["3", "4"]
        : year === "3" ? ["5", "6"]
        : year === "4" ? ["7", "8"]
        : []
      : courseLevel === "PG"
        ? year === "1" ? ["1", "2"]
          : year === "2" ? ["3", "4"]
          : []
        : [];

  const moduleOptions = ["1", "2", "3", "4"];

  const subjectData: Record<string, Record<string, string[]>> = {
    "Computer Science": {
      "1": ["Mathematics", "Statistics", "Digital Fundamentals"],
      "2": ["C Programming", "Discrete Mathematics"],
      "3": ["Data Structures", "OOP"],
      "4": ["DBMS", "Java"],
      "5": ["Operating System", "Computer Networks"],
      "6": ["Compiler Design", "Python"],
      "7": ["Machine Learning", "Cloud Computing"],
      "8": ["Project", "Seminar"],
    },
    Mathematics: {
      "1": ["Algebra"], "2": ["Calculus"],
      "3": ["Linear Algebra"], "4": ["Differential Equations"],
    },
    Physics: {
      "1": ["Mechanics"], "2": ["Properties of Matter"],
      "3": ["Electricity"], "4": ["Optics"],
    },
  };

  const subjectOptions =
    department && semester ? subjectData[department]?.[semester] || [] : [];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!title.trim()) return showToast("Enter a title", "error");
    if (!file) return showToast("Select a file", "error");
    if (!department) return showToast("Select department", "error");
    if (!subject) return showToast("Select subject", "error");
    if (!courseLevel) return showToast("Select course level", "error");
    if (!year) return showToast("Select year", "error");
    if (!semester) return showToast("Select semester", "error");
    if (!module) return showToast("Select module", "error");

    setUploading(true);

    const materials = await getMaterials();
    const exists = materials.some(
      (item: any) =>
        item.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        item.department === department &&
        item.course_level === (courseLevel === "UG" ? "Graduate" : "Post Graduate") &&
        item.year === Number(year) &&
        item.semester === Number(semester) &&
        item.subject === subject &&
        item.module === Number(module),
    );

    if (exists) {
      setUploading(false);
      return showToast("Material with this title already exists", "error");
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("department", department);
    formData.append("subject", subject);
    formData.append("course_level", courseLevel);
    formData.append("year", year);
    formData.append("semester", semester);
    formData.append("module", module);
    formData.append("file", file);

    try {
      const result = await uploadMaterial(formData);
      console.log(result);
      showToast("Material uploaded successfully!", "success");
      setTitle(""); setDepartment(""); setSubject("");
      setCourseLevel(""); setYear(""); setSemester("");
      setModule(""); setFile(null);
    } catch (error) {
      console.error(error);
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    
    <div className="upload-page">
      {/* Toast */}
      {toast && (
        <div className={`upload-toast ${toast.type}`}>
          {toast.type === "success" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <div className="upload-card">
        {/* Header */}
        <div className="upload-header">
          <div className="upload-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <h2 className="upload-title">Upload Material</h2>
            <p className="upload-subtitle">Share notes, papers &amp; resources with your peers</p>
          </div>
        </div>

        <div className="upload-body">
          {/* Title */}
          <div className="field-group">
            <label className="field-label">Title</label>
            <input
              className="field-input"
              type="text"
              value={title}
              placeholder="e.g. Unit 2 — Binary Trees"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Row: Course Level + Department */}
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Course Level</label>
              <select
                className="field-select"
                value={courseLevel}
                onChange={(e) => {
                  setCourseLevel(e.target.value);
                  setDepartment(""); setYear(""); setSemester(""); setSubject("");
                }}
              >
                <option value="">Select</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Department</label>
              <select
                className="field-select"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setYear(""); setSemester(""); setSubject("");
                }}
              >
                <option value="">Select</option>
                {["Computer Science","Mathematics","Physics","Chemistry","Zoology","Economics","English"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Year + Semester */}
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Year</label>
              <select
                className="field-select"
                value={year}
                disabled={!courseLevel}
                onChange={(e) => {
                  setYear(e.target.value);
                  setSemester(""); setSubject("");
                }}
              >
                <option value="">Select</option>
                {yearOptions.map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Semester</label>
              <select
                className="field-select"
                value={semester}
                disabled={!year}
                onChange={(e) => {
                  setSemester(e.target.value);
                  setSubject("");
                }}
              >
                <option value="">Select</option>
                {semesterOptions.map(s => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Subject + Module */}
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Subject</label>
              <select
                className="field-select"
                value={subject}
                disabled={!semester || subjectOptions.length === 0}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select</option>
                {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Module</label>
              <select
                className="field-select"
                value={module}
                onChange={(e) => setModule(e.target.value)}
              >
                <option value="">Select</option>
                {moduleOptions.map(m => <option key={m} value={m}>Module {m}</option>)}
              </select>
            </div>
          </div>

          {/* File Drop Zone */}
          <div className="field-group">
            <label className="field-label">File</label>
            <div
              className={`dropzone ${dragOver ? "drag-active" : ""} ${file ? "has-file" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => { if (e.target.files) setFile(e.target.files[0]); }}
              />
              {file ? (
                <div className="dropzone-file-info">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="dropzone-filename">{file.name}</span>
                  <span className="dropzone-filesize">{(file.size / 1024).toFixed(1)} KB</span>
                  <button className="dropzone-clear" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="dropzone-placeholder">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="dropzone-hint"><span>Click to browse</span> or drag &amp; drop</p>
                  <p className="dropzone-types">PDF, DOC, DOCX, PPT, images</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            className={`upload-btn ${uploading ? "uploading" : ""}`}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="spinner" />
                Uploading…
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Material
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Upload;