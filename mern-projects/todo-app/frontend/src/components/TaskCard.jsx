import { Link } from "react-router-dom";

function TaskCard({ task, onStatusChange, onDelete }) {
  const formattedDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className={`task-card priority-${task.priority} status-${task.status}`}>
      <div className="task-info">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <span className={`status-badge ${task.status}`}>
            {task.status}
          </span>
        </div>
        
        <div className="task-meta">
          <span>Priority: <strong>{task.priority}</strong></span>
          <span>Due: <strong>{formattedDate}</strong></span>
        </div>
      </div>

      <div className="task-actions">
        {task.status === "Pending" ? (
          <button 
            className="btn btn-success"
            onClick={() => onStatusChange(task._id, "Completed")}
            title="Mark as Completed"
          >
            ✓
          </button>
        ) : (
          <button 
            className="btn btn-secondary"
            onClick={() => onStatusChange(task._id, "Pending")}
            title="Mark as Pending"
          >
            ↺
          </button>
        )}
        <Link to={`/task/${task._id}`} className="btn btn-primary" title="View Details">
          View
        </Link>
        <Link to={`/edit/${task._id}`} className="btn btn-secondary" title="Edit">
          Edit
        </Link>
        <button 
          className="btn btn-danger"
          onClick={() => onDelete(task._id)}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
