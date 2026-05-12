import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StudentCard from "../components/StudentCard";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function HomePage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/students`);
      setStudents(res.data.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch students. Make sure the server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(`${API_URL}/students/${id}`);
      setStudents(students.filter((s) => s._id !== id));
    } catch (err) {
      alert("Failed to delete student.");
      console.error(err);
    }
  };

  // Get CGPA badge class
  const getCgpaClass = (cgpa) => {
    if (cgpa >= 8) return "cgpa-high";
    if (cgpa >= 6) return "cgpa-mid";
    return "cgpa-low";
  };

  if (loading) return <div className="loading">Loading student records...</div>;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Student Records</h1>
        <span className="record-count">
          {students.length} {students.length === 1 ? "record" : "records"} found
        </span>
      </div>

      {students.length === 0 ? (
        <div className="empty-message">
          <h2>No students found</h2>
          <p>Add your first student record to get started!</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="student-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No.</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>CGPA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.fullName}</td>
                    <td>{student.rollNumber}</td>
                    <td>{student.department}</td>
                    <td>{student.year}</td>
                    <td>
                      <span className={`cgpa-badge ${getCgpaClass(student.cgpa)}`}>
                        {student.cgpa}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/student/${student._id}`}
                          className="btn-sm btn-view"
                        >
                          View
                        </Link>
                        <Link
                          to={`/edit/${student._id}`}
                          className="btn-sm btn-edit"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn-sm btn-delete"
                          onClick={() => handleDelete(student._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="student-cards">
            {students.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
