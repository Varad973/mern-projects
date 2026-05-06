import { useState, useEffect } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch To Do's. Ensure the server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find((t) => t._id === taskId);
      if (!taskToUpdate) return;

      setTasks(
        tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );

      await axios.put(`${API_URL}/tasks/${taskId}`, {
        ...taskToUpdate,
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update status", err);
      fetchTasks(); // Revert on failure
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this To Do?")) return;
    
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete To Do");
    }
  };

  if (loading) return <div className="loading">Loading To Do's...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>My To Do's</h1>
        <div style={{ color: "#64748b", fontWeight: 500 }}>
          {tasks.length} {tasks.length === 1 ? 'To Do' : "To Do's"}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tasks.length === 0 && !error ? (
        <div className="empty-message">
          <h2>No To Do's found</h2>
          <p>You're all caught up! Add a new To Do to get started.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
