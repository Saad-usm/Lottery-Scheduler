import React, { useEffect } from 'react';
import './App.css';

const SchedulerControls = ({
  schedulingQuantum,
  setSchedulingQuantum,
  simulationStatus,
  toggleSimulation,
  stopSimulation,
  displayedResults,
  setDisplayedResults,
  results,
  tasks
}) => {
  const getTaskColor = (index) => `hsl(${360 * (index / tasks.length)}, 70%, 50%)`;

  useEffect(() => {
    let intervalId;
    if (simulationStatus === 'running') {
      intervalId = setInterval(() => {
        const nextResult = results[displayedResults.length];
        if (nextResult !== undefined) {
          setDisplayedResults((prev) => [...prev, nextResult]);
        } else {
          clearInterval(intervalId);
        }
      }, 500); // Adjust the interval as needed
    }

    return () => clearInterval(intervalId);
  }, [simulationStatus, results, displayedResults, setDisplayedResults]);

  return (
    <div className="Scheduler-output" style={{ minWidth: '350px' }}>
      <label style={{ color: '#FFFFFF' }}>
        Scheduling Quantum:
        <input
          type="number"
          value={schedulingQuantum}
          onChange={(e) => setSchedulingQuantum(Number(e.target.value))}
        />
      </label>
      <button onClick={toggleSimulation} style={{ marginLeft: '10px' }}>
        {simulationStatus === 'running' ? 'Pause Simulation' : simulationStatus === 'paused' ? 'Resume Simulation' : 'Start Simulation'}
      </button>
      <button onClick={stopSimulation} style={{ marginLeft: '10px' }}>Stop Simulation</button>
      {(simulationStatus === 'running' || simulationStatus === 'paused' || displayedResults.length > 0) && (
        <div className="Results-container" style={{ marginTop: '20px' }}>
          <h2>Simulation Results</h2>
          {displayedResults.map((result, index) => {
            const match = result.match(/Running Task: (\d+)/);
            const taskId = match ? parseInt(match[1], 10) - 1 : 0; // Adjust for zero-based indexing and ensure a fallback
            
            const borderColor = getTaskColor(taskId);
            const displayResult = result.replace(/Scheduling Quantum: \d+s, /, ''); // Remove "Scheduling Quantum: Xs, "
            return (
              <div key={index} className="Result-box" style={{ borderColor }}>Step {index + 1}: {displayResult}</div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SchedulerControls;
