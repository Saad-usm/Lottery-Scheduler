import React from 'react';

const TaskManager = ({ tasks, handleTaskChange, handleAddTask, handleRemoveTask }) => (
  <div className="Task-manager" style={{ minWidth: '300px' }}>
    {tasks.map((task, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ marginRight: '10px' }}>
          <label>
            Task {index + 1} Runtime:
            <input 
              type="number" 
              value={task.runtime} 
              onChange={(e) => handleTaskChange(index, 'runtime', e.target.value)} 
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Tickets:
            <input 
              type="number" 
              value={task.tickets} 
              onChange={(e) => handleTaskChange(index, 'tickets', e.target.value)} 
            />
          </label>
        </div>
        <button onClick={() => handleRemoveTask(index)}>Remove</button>
      </div>
    ))}
    <button onClick={handleAddTask} style={{ marginTop: '10px' }}>Add Task</button>
  </div>
);

export default TaskManager;
