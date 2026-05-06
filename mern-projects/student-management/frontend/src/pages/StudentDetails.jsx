import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`${API_URL}/students/${id}`);
      setStudent(res.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load student.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(`${API_URL}/students/${id}`);
      navigate("/");
    } catch (err) {
      setError("Failed to delete student.");
    }
  };

  // Get CGPA badge class
  const getCgpaClass = (cgpa) => {
    if (cgpa >= 8) return "cgpa-high";
    if (cgpa >= 6) return "cgpa-mid";
    return "cgpa-low";
  };

  if (loading) return <div className="loading">Loading student...</div>;

  if (error) return <div className="error-message">{error}</div>;

  if (!student) return <div className="error-message">Student not found.</div>;

  const formattedDate = new Date(student.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <div className="student-detail">
        <h1>{student.fullName}</h1>
        <span className="detail-roll">{student.rollNumber}</span>

        <div className="detail-grid">
          <div className="detail-item">
            <label>Email</label>
            <span>{student.email}</span>
          </div>

          <div className="detail-item">
            <label>Department</label>
            <span>{student.department}</span>
          </div>

          <div className="detail-item">
            <label>Year</label>
            <span>{student.year}</span>
          </div>

          <div className="detail-item">
            <label>CGPA</label>
            <span className={`cgpa-badge ${getCgpaClass(student.cgpa)}`}>
              {student.cgpa}
            </span>
          </div>

          <div className="detail-item">
            <label>Record Created</label>
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="detail-actions">
          <Link to={`/edit/${student._id}`} className="btn btn-primary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
          <Link to="/" className="btn btn-secondary">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;
