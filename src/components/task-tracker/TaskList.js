import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDelete, onToggle }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-inbox"></i>
        <p>No tasks yet! Add your first task to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem 
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default TaskList;