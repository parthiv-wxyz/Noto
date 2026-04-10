import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import SearchBar from "../components/SearchBar";
import FileCard from "../components/FileCard";
import { getMaterials } from "../services/materialService";
import type { Material } from "../utils/types/material";

const DEPARTMENTS = ["Computer Science", "Mathematics", "Physics", "Chemistry"];

const SUBJECT_DATA: Record<string, Record<string, string[]>> = {
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
    "1": ["Algebra"], "2": ["Calculus"], "3": ["Linear Algebra"], "4": ["Differential Equations"],
  },
};

function Browse() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [searched, setSearched] = useState(false);

  const semesterOptions =
    courseLevel === "UG" ? ["1","2","3","4","5","6","7","8"] :
    courseLevel === "PG" ? ["1","2","3","4"] : [];

  const subjectOptions = department && semester ? SUBJECT_DATA[department]?.[semester] ?? [] : [];

  const fetchMaterials = async (overrides?: Record<string, string>) => {
    const filters: Record<string, string> = {};
    const s = overrides?.search ?? search;
    const cl = overrides?.courseLevel ?? courseLevel;
    const dep = overrides?.department ?? department;
    const sem = overrides?.semester ?? semester;
    const sub = overrides?.subject ?? subject;
    if (s.trim()) filters.search = s;
    if (cl) filters.course_level = cl;
    if (dep) filters.department = dep;
    if (sem) filters.semester = sem;
    if (sub) filters.subject = sub;
    try {
      const data = await getMaterials(filters);
      setMaterials(data);
      setSearched(true);
    } catch (err) {
      console.error("Failed to fetch materials", err);
    }
  };

  const handleSearchInput = async (value: string) => {
    setSearch(value);
    if (!value.trim()) { setMaterials([]); setSearched(false); return; }
    await fetchMaterials({ search: value });
  };

  const handleRefresh = () => {
    setSearch(""); setCourseLevel(""); setDepartment(""); setSemester(""); setSubject("");
    setMaterials([]); setSearched(false);
  };

  return (
    <>
      <Navbar />
      <div className="browse-root">
        <div className="browse-container">
          <div className="browse-header">
            <h1 className="browse-title">Browse Materials</h1>
            <p className="browse-sub">Search notes, question papers, and resources from your peers</p>
          </div>

          <div className="browse-filters">
            <SearchBar value={search} onChange={handleSearchInput} />

            <div className="browse-selects">
              <select className="browse-select" value={courseLevel} onChange={(e) => { setCourseLevel(e.target.value); setDepartment(""); setSemester(""); setSubject(""); }}>
                <option value="">Course Level</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
              </select>

              <select className="browse-select" value={department} onChange={(e) => { setDepartment(e.target.value); setSemester(""); setSubject(""); }}>
                <option value="">Department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>

              <select className="browse-select" value={semester} onChange={(e) => { setSemester(e.target.value); setSubject(""); }} disabled={!courseLevel}>
                <option value="">Semester</option>
                {semesterOptions.map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>

              <select className="browse-select" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={!semester}>
                <option value="">Subject</option>
                {subjectOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="browse-actions">
              <button className="browse-btn-primary" onClick={() => fetchMaterials()}>Search</button>
              <button className="browse-btn-ghost" onClick={handleRefresh}>Reset</button>
            </div>
          </div>

          {/* Results */}
          <div className="browse-results">
            {materials.length > 0 ? (
              <>
                <p className="browse-results-count">{materials.length} result{materials.length !== 1 ? "s" : ""}</p>
                <div className="browse-grid">
                  {materials.map((material) => (
                    <FileCard key={material.id} material={material} />
                  ))}
                </div>
              </>
            ) : searched ? (
              <div className="browse-empty">
                <div className="browse-empty-icon">🔍</div>
                <p>No materials found. Try adjusting your filters.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

        .browse-root {
          flex: 1;
          background: #080f1f;
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 62px);
          padding: 2rem 1.5rem 3rem;
        }

        .browse-container {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .browse-header { display: flex; flex-direction: column; gap: 0.3rem; }

        .browse-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem;
          color: #f0f4ff;
          margin: 0;
          font-weight: 600;
        }

        .browse-sub { color: #4f5f80; font-size: 0.85rem; margin: 0; }

        .browse-filters {
          background: #0e1628;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .browse-selects {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.75rem;
        }

        .browse-select {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          padding: 0.55rem 0.85rem;
          color: #c8d3e8;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
          transition: border-color 0.18s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236b7a99' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2rem;
        }

        .browse-select:focus { border-color: rgba(232,162,50,0.45); }
        .browse-select:disabled { opacity: 0.4; cursor: not-allowed; }
        .browse-select option { background: #0e1628; color: #c8d3e8; }

        .browse-actions { display: flex; gap: 0.75rem; }

        .browse-btn-primary {
          padding: 0.55rem 1.3rem;
          background: #e8a232;
          border: none;
          border-radius: 9px;
          color: #080f1f;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.18s;
        }
        .browse-btn-primary:hover { opacity: 0.88; }

        .browse-btn-ghost {
          padding: 0.55rem 1.1rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          color: #6b7a99;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }
        .browse-btn-ghost:hover { background: rgba(255,255,255,0.05); color: #c8d3e8; }

        .browse-results-count {
          font-size: 0.78rem;
          color: #4f5f80;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
        }

        .browse-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .browse-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: #4f5f80;
          font-size: 0.9rem;
        }

        .browse-empty-icon { font-size: 2rem; margin-bottom: 0.75rem; }
      `}</style>
    </>
  );
}

export default Browse;