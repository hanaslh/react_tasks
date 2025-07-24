import React, { useState, useEffect } from 'react';

const TaskItem = ({ task, onDelete, onToggle }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    if (!task.dueDate || task.completed) return;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const dueDate = new Date(task.dueDate);
      const diff = dueDate - now;
      
      if (diff <= 0) {
        setTimeLeft('Overdue!');
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    
    return () => clearInterval(interval);
  }, [task.dueDate, task.completed]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(task.id);
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${task.isOverdue ? 'overdue' : ''}`}>
      {task.completed && <div className="completed-indicator">Completed</div>}
      <div className="task-content">
        <div className="task-header">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          />
          <span 
            className="task-text"
            onClick={() => onToggle(task.id)}
          >
            {task.text}
          </span>
        </div>
        
        <div className="task-meta">
          <div className="due-info">
            {task.dueDate && (
              <div className="task-date">
                <i className="fas fa-calendar-day"></i> Due: {formatDate(task.dueDate)}
              </div>
            )}
            
            {!task.completed && task.dueDate && (
              <div className={`time-left ${task.isOverdue ? 'overdue-text' : ''}`}>
                <i className="fas fa-clock"></i> {timeLeft}
              </div>
            )}
          </div>
          
          <div className="task-actions">
            <button className="action-btn delete-btn" onClick={handleDelete}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
      {showConfirm && (
        <div className="confirmation-dialog">
          <div className="confirmation-content">
            <p>Are you sure you want to delete this task?</p>
            <div className="confirmation-buttons">
              <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
              <button className="confirm-delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;