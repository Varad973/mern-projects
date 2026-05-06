import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function AddTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/tasks`, formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create To Do.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to List
      </Link>
      
      <div className="form-container">
        <h1>Add New To Do</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">To Do Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? "Adding..." : "Add To Do"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTask;
