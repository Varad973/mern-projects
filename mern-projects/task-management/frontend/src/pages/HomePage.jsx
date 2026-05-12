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
      setTasks(res.data.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tasks. Ensure the server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Find the existing task in state
      const taskToUpdate = tasks.find((t) => t._id === taskId);
      if (!taskToUpdate) return;

      // Optimistic update
      setTasks(
        tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );

      // Make API call
      await axios.put(`${API_URL}/tasks/${taskId}`, {
        ...taskToUpdate,
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert on failure
      fetchTasks();
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>My Tasks</h1>
        <div>
          <span style={{ marginRight: "10px", color: "#666" }}>
            Total: {tasks.length}
          </span>
          <span style={{ color: "#27ae60", fontWeight: "bold" }}>
            Completed: {tasks.filter(t => t.status === "Completed").length}
          </span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tasks.length === 0 && !error ? (
        <div className="empty-message">
          <h2>No tasks found</h2>
          <p>Create your first task to get organized!</p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onStatusChange={handleStatusChange} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
