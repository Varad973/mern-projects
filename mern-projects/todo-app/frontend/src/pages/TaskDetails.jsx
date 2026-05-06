import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks/${id}`);
      setTask(res.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load To Do details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this To Do?")) return;

    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      navigate("/");
    } catch (err) {
      setError("Failed to delete To Do.");
    }
  };

  if (loading) return <div className="loading">Loading details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!task) return <div className="error-message">To Do not found.</div>;

  const formattedDueDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const formattedCreatedDate = new Date(task.createdAt).toLocaleString("en-US");

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to List
      </Link>

      <div className="task-detail">
        <div className="detail-header">
          <h1>{task.title}</h1>
          <span className={`status-badge ${task.status}`}>
            {task.status}
          </span>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Priority</span>
            <span className="detail-value" style={{ 
                color: task.priority === "High" ? "#ef4444" : 
                       task.priority === "Medium" ? "#f59e0b" : "#3b82f6" 
              }}>
              {task.priority}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Due Date</span>
            <span className="detail-value">{formattedDueDate}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Created At</span>
            <span className="detail-value">{formattedCreatedDate}</span>
          </div>
        </div>

        <div className="detail-desc">
          {task.description}
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to={`/edit/${task._id}`} className="btn btn-primary">
            Edit To Do
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete To Do
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
