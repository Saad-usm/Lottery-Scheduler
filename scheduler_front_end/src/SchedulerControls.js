// SchedulerControls.js
import React, { useEffect } from 'react';

const SchedulerControls = ({ schedulingQuantum, setSchedulingQuantum, simulationStatus, toggleSimulation, stopSimulation, displayedResults, setDisplayedResults, results }) => {
  
  useEffect(() => {
    let intervalId;
    if (simulationStatus === 'running') {
      intervalId = setInterval(() => {
        const nextResult = results[displayedResults.length];
        if (nextResult !== undefined) {
          setDisplayedResults(prev => [...prev, nextResult]);
        } else {
          clearInterval(intervalId);
        }
      }, 100); // Adjust the interval as needed
    }

    return () => clearInterval(intervalId);
  }, [simulationStatus, results, displayedResults, setDisplayedResults]);

  return (
    <div className="Scheduler-output" style={{ minWidth: '300px' }}>
            <label>
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
            <div className="Results-container" style={{ marginTop: '20px' }}>
              <h3>Simulation Results</h3>
              {displayedResults.map((result, index) => (
                <div key={index}>Step {index + 1}: {result}</div>
              ))}
            </div>
          </div>
  );
};

export default SchedulerControls;
