import { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import SearchBar from "../components/SearchBar";
import FileCard from "../components/FileCard";
import { getMaterials } from "../services/materialService";
import type { Material } from "../utils/types/material";

function Browse() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");

  const semesterOptions =
    courseLevel === "UG"
      ? ["1", "2", "3", "4", "5", "6", "7", "8"]
      : courseLevel === "PG"
      ? ["1", "2", "3", "4"]
      : [];

  const subjectData: Record<string, Record<string, string[]>> = {
    "Computer Science": {
      "1": ["Mathematics", "Statistics"],
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
  };

  const subjectOptions =
    department && semester ? subjectData[department]?.[semester] || [] : [];

  const handleSearch = async () => {
    try {
      const filters: any = {};

      if (search.trim()) filters.search = search;
      if (courseLevel) filters.course_level = courseLevel;
      if (department) filters.department = department;
      if (semester) filters.semester = semester;
      if (subject) filters.subject = subject;

      const data = await getMaterials(filters);

      const filtered = data.filter((item: Material) =>
        item.title.toLowerCase().startsWith(search.toLowerCase())
      );

      setMaterials(search ? filtered : data);
    } catch (error) {
      console.error("Failed to fetch materials", error);
    }
  };

  const handleSearchInput = async (value: string) => {
  setSearch(value);

  if (!value.trim()) {
    setMaterials([]);
    return;
  }

  try {
    const data = await getMaterials({
      search: value,
      course_level: courseLevel,
      department,
      semester,
      subject,
    });

    setMaterials(data);
  } catch (error) {
    console.error(error);
  }
};

  const handleRefresh = () => {
    setSearch("");
    setCourseLevel("");
    setDepartment("");
    setSemester("");
    setSubject("");
    setMaterials([]);
  };

  return (
    <>
      <Navbar />

      <div>
        <h2>Browse Materials</h2>

        <SearchBar value={search} onChange={handleSearchInput} />

        <br />
        <br />

        <select
          value={courseLevel}
          onChange={(e) => {
            setCourseLevel(e.target.value);
            setDepartment("");
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
            setSemester("");
            setSubject("");
          }}
        >
          <option value="">Select Department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
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
          {semesterOptions.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>

        <br />
        <br />

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjectOptions.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        <br />
        <br />

        <button onClick={handleSearch}>Search</button>
        <button onClick={handleRefresh}>Refresh</button>

        <br />
        <br />

        {materials.length > 0 &&
          materials.map((material) => (
            <FileCard key={material.id} material={material} />
          ))}
      </div>
    </>
  );
}

export default Browse;