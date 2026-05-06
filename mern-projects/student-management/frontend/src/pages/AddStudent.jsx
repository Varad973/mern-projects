import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    email: "",
    department: "Computer Engineering",
    year: "1st Year",
    cgpa: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const departments = [
    "Computer Engineering",
    "Information Technology",
    "Electronics & Telecommunication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/students`, {
        ...formData,
        cgpa: parseFloat(formData.cgpa),
      });
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add student. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
      <div className="form-container">
        <h1>Add New Student</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rollNumber">Roll Number</label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g. 31208"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year">Year</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                {years.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cgpa">CGPA (0 - 10)</label>
            <input
              type="number"
              id="cgpa"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="Enter CGPA"
              min="0"
              max="10"
              step="0.01"
              required
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Adding..." : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
