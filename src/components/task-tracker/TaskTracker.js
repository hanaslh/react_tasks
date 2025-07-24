import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import './TaskTracker.css';

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [sortOption, setSortOption] = useState('dueDate');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedTasks = tasks.map(task => {
        if (!task.completed && task.dueDate && new Date(task.dueDate) < now) {
          return { ...task, isOverdue: true };
        }
        return task;
      });
      setTasks(updatedTasks);
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const addTask = (text, dueDate) => {
    const newTask = {
      id: Date.now(),
      text,
      dueDate,
      completed: false,
      isOverdue: false,
      createdAt: new Date().toISOString()
    };
    
    if (dueDate && new Date(dueDate) < new Date()) {
      newTask.isOverdue = true;
    }
    
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        completed: !task.completed,
        isOverdue: task.completed ? task.isOverdue : false
      } : task
    ));
  };

  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      
      if (sortOption === 'dueDate') {
        if (!a.dueDate && b.dueDate) return 1;
        if (a.dueDate && !b.dueDate) return -1;
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const overdueCount = tasks.filter(t => t.isOverdue).length;

  return (
    <div className="task-tracker-container">
      <header className="app-header">
        <h1><i className="fas fa-tasks"></i>Task Tracker</h1>
        <p>Organize your work</p>
      </header>
      
      <main className="main-content">
        <div className="dashboard">
          <TaskForm onAdd={addTask} />
          
          <div className="task-list-section">
            <div className="task-controls">
              <div className="sort-options">
                <button 
                  className={`sort-btn ${sortOption === 'dueDate' ? 'active' : ''}`}
                  onClick={() => setSortOption('dueDate')}
                >
                  <i className="fas fa-sort-amount-down"></i> Due Date
                </button>
                <button 
                  className={`sort-btn ${sortOption === 'createdAt' ? 'active' : ''}`}
                  onClick={() => setSortOption('createdAt')}
                >
                  <i className="fas fa-clock"></i> Recently Added
                </button>
              </div>
              
              <div className="stats">
                <div className="stat-item">
                  <i className="fas fa-check-circle" style={{ color: '#00b894' }}></i>
                  <span>{completedCount}</span> completed
                </div>
                <div className="stat-item">
                  <i className="fas fa-exclamation-triangle" style={{ color: '#d63031' }}></i>
                  <span>{overdueCount}</span> overdue
                </div>
              </div>
            </div>
            
            <h2 className="section-title"><i className="fas fa-list-check"></i> Your Tasks</h2>
            <TaskList 
              tasks={getSortedTasks()} 
              onDelete={deleteTask} 
              onToggle={toggleComplete} 
            />
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="copyright">
          &copy; {new Date().getFullYear()} Task Tracker | Developed with React
        </div>
      </footer>
    </div>
  );
};

export default TaskTracker;