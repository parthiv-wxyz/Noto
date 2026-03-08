import { useState } from "react";
import { uploadMaterial, getMaterials } from "../services/materialService";

function Upload() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [module, setModule] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const yearOptions =
    courseLevel === "UG"
      ? ["1", "2", "3", "4"]
      : courseLevel === "PG"
        ? ["1", "2"]
        : [];

  const semesterOptions =
    courseLevel === "UG"
      ? year === "1"
        ? ["1", "2"]
        : year === "2"
          ? ["3", "4"]
          : year === "3"
            ? ["5", "6"]
            : year === "4"
              ? ["7", "8"]
              : []
      : courseLevel === "PG"
        ? year === "1"
          ? ["1", "2"]
          : year === "2"
            ? ["3", "4"]
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
      "1": ["Algebra"],
      "2": ["Calculus"],
      "3": ["Linear Algebra"],
      "4": ["Differential Equations"],
    },
    Physics: {
      "1": ["Mechanics"],
      "2": ["Properties of Matter"],
      "3": ["Electricity"],
      "4": ["Optics"],
    },
  };

  const subjectOptions =
    department && semester ? subjectData[department]?.[semester] || [] : [];

  const handleUpload = async () => {
    if (!title.trim()) {
      alert("Enter title");
      return;
    }

    if (!file) {
      alert("Select a file");
      return;
    }

    if (!department) {
      alert("Select department");
      return;
    }

    if (!subject) {
      alert("Select subject");
      return;
    }

    if (!courseLevel) {
      alert("Select course level");
      return;
    }

    if (!year) {
      alert("Select year");
      return;
    }

    if (!semester) {
      alert("Select semester");
      return;
    }

    if (!module) {
      alert("Select module");
      return;
    }

    const materials = await getMaterials();

    const exists = materials.some(
      (item: any) =>
        item.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        item.department === department &&
        item.course_level ===
          (courseLevel === "UG" ? "Graduate" : "Post Graduate") &&
        item.year === Number(year) &&
        item.semester === Number(semester) &&
        item.subject === subject &&
        item.module === Number(module),
    );

    if (exists) {
      alert("Material title already exists");
      return;
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
      alert("Upload successful");
      setTitle("");
      setDepartment("");
      setSubject("");
      setCourseLevel("");
      setYear("");
      setSemester("");
      setModule("");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Material</h2>

      <input
        type="text"
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <select
        value={courseLevel}
        onChange={(e) => {
          setCourseLevel(e.target.value);
          setDepartment("");
          setYear("");
          setSemester("");
          setSubject("");
        }}
      >
        <option value="">Select Course Level</option>
        <option value="UG">UG</option>
        <option value="PG">PG</option>
      </select>

      <br />
      <br />

      <select
        value={department}
        onChange={(e) => {
          setDepartment(e.target.value);
          setYear("");
          setSemester("");
          setSubject("");
        }}
      >
        <option value="">Select Department</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Physics">Physics</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Zoology">Zoology</option>
        <option value="Economics">Economics</option>
        <option value="English">English</option>
      </select>

      <br />
      <br />

      <select
        value={year}
        onChange={(e) => {
          setYear(e.target.value);
          setSemester("");
          setSubject("");
        }}
      >
        <option value="">Select Year</option>
        {yearOptions.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
        value={semester}
        onChange={(e) => {
          setSemester(e.target.value);
          setSubject("");
        }}
      >
        <option value="">Select Semester</option>
        {semesterOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">Select Subject</option>
        {subjectOptions.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select value={module} onChange={(e) => setModule(e.target.value)}>
        <option value="">Select Module</option>
        {moduleOptions.map((m) => (
          <option key={m} value={m}>
            Module {m}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <br />
      <br />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Upload;
