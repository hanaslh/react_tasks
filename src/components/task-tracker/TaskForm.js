import React, { useState } from 'react';

const TaskForm = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter a task description');
      return;
    }
    
    onAdd(text, dueDate);
    setText('');
    setDueDate('');
    setError('');
  };

  return (
    <div className="task-form-section">
      <h2 className="section-title"><i className="fas fa-plus-circle"></i> Add New Task</h2>
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="task-input">Task Description</label>
          <input
            type="text"
            id="task-input"
            className="task-input"
            placeholder="What needs to be done?"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError('');
            }}
          />
          <div className="error-message">{error}</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="due-date">Due Date & Time</label>
          <input
            type="datetime-local"
            id="due-date"
            className="due-date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        
        <button type="submit" className="add-button">
          <i className="fas fa-plus"></i> Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;