import { Link } from "react-router-dom";

function StudentCard({ student, onDelete }) {
  // Get CGPA badge class
  const getCgpaClass = (cgpa) => {
    if (cgpa >= 8) return "cgpa-high";
    if (cgpa >= 6) return "cgpa-mid";
    return "cgpa-low";
  };

  return (
    <div className="student-card">
      <div className="card-header">
        <span className="card-name">{student.fullName}</span>
        <span className="card-roll">{student.rollNumber}</span>
      </div>
      <div className="card-info">
        <span><strong>Email:</strong> {student.email}</span>
        <span><strong>Dept:</strong> {student.department}</span>
        <span><strong>Year:</strong> {student.year}</span>
        <span>
          <strong>CGPA:</strong>{" "}
          <span className={`cgpa-badge ${getCgpaClass(student.cgpa)}`}>
            {student.cgpa}
          </span>
        </span>
      </div>
      <div className="card-actions">
        <Link to={`/student/${student._id}`} className="btn-sm btn-view">
          View
        </Link>
        <Link to={`/edit/${student._id}`} className="btn-sm btn-edit">
          Edit
        </Link>
        <button
          className="btn-sm btn-delete"
          onClick={() => onDelete(student._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
