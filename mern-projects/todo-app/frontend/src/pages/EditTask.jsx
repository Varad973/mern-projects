import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks/${id}`);
      const task = res.data.data;
      
      const dateObj = new Date(task.dueDate);
      const formattedDate = dateObj.toISOString().split("T")[0];

      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: formattedDate,
      });
      setError(null);
    } catch (err) {
      setError("Failed to load To Do data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await axios.put(`${API_URL}/tasks/${id}`, formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update To Do.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading task...</div>;

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to List
      </Link>
      
      <div className="form-container">
        <h1>Edit To Do</h1>

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
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
            {saving ? "Saving Changes..." : "Update To Do"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditTask;
