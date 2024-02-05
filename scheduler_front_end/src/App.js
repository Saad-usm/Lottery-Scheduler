import React, { useState, useEffect } from 'react';
import schedulerModule from './wasm/scheduler';
import TaskCompletionGraph from './TaskCompletionGraph';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [displayedResults, setDisplayedResults] = useState([]);
  const [scheduler, setScheduler] = useState(null);
  const [tasks, setTasks] = useState([{ runtime: 10, tickets: 5 }]);
  const [schedulingQuantum, setSchedulingQuantum] = useState(2);
  const [simulationStatus, setSimulationStatus] = useState('stopped');

  useEffect(() => {
    schedulerModule().then((module) => {
      setScheduler(module);
    });
  }, []);

  useEffect(() => {
    let intervalId;
    if (simulationStatus === 'running') {
      intervalId = setInterval(() => {
        setDisplayedResults((currentDisplayedResults) => {
          const nextResult = results[currentDisplayedResults.length];
          if (nextResult) {
            return [...currentDisplayedResults, nextResult];
          }
          clearInterval(intervalId);
          setSimulationStatus('stopped');
          return currentDisplayedResults;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [results, simulationStatus]);

  const handleRunSchedulerClick = () => {
    if (scheduler && simulationStatus !== 'running') {
      const executionSpeed = 1; // Assuming execution speed is constant for simplicity.
      const schedulerResultHandle = scheduler.runLotteryScheduler(tasks.length, executionSpeed, schedulingQuantum, tasks);

      const resultArray = [];
      for (let i = 0; i < schedulerResultHandle.size(); i++) {
        resultArray.push(schedulerResultHandle.get(i));
      }
      setResults(resultArray);
      setDisplayedResults([]);
    }
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, [field]: Number(value) };
      }
      return task;
    });
    setTasks(newTasks);
  };

  const handleAddTask = () => {
    setTasks([...tasks, { runtime: 0, tickets: 0 }]);
  };

  const toggleSimulation = () => {
    if (simulationStatus === 'stopped') {
      handleRunSchedulerClick();
    }
    setSimulationStatus((currentStatus) =>
      currentStatus === 'running' ? 'paused' : 'running'
    );
  };

  const stopSimulation = () => {
    setSimulationStatus('stopped');
    setDisplayedResults([]);
    setResults([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Lottery Scheduler Simulation</h2>
        <div className="App-content">
          <div className="Task-manager">
            {tasks.map((task, index) => (
              <div key={index}>
                <label>
                  Task {index + 1} Runtime:
                  <input 
                    type="number" 
                    value={task.runtime} 
                    onChange={(e) => handleTaskChange(index, 'runtime', e.target.value)} 
                  />
                </label>
                <label>
                  Tickets:
                  <input 
                    type="number" 
                    value={task.tickets} 
                    onChange={(e) => handleTaskChange(index, 'tickets', e.target.value)} 
                  />
                </label>
              </div>
            ))}
            <button onClick={handleAddTask}>Add Task</button>
          </div>
          <div className="Scheduler-output">
            <label>
              Scheduling Quantum:
              <input 
                type="number" 
                value={schedulingQuantum} 
                onChange={(e) => setSchedulingQuantum(Number(e.target.value))} 
              />
            </label>
            <button onClick={toggleSimulation}>
              {simulationStatus === 'running' ? 'Pause Simulation' : simulationStatus === 'paused' ? 'Resume Simulation' : 'Start Simulation'}
            </button>
            <button onClick={stopSimulation}>Stop Simulation</button>
            <div className="Results-container">
              {displayedResults.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          </div>
          {/* <div className="TaskCompletionGraph-container">
            <TaskCompletionGraph tasks={tasks} results={displayedResults} />
          </div> */}
        </div>
      </header>
    </div>
  );
}

export default App;
