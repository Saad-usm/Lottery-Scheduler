import React, { useState, useEffect } from 'react';
import wasmModule from './wasm/hello'; // Update the path to match your WASM module
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [wasm, setWasm] = useState(null);

  useEffect(() => {
    wasmModule().then((module) => {
      setWasm(module);
    });
  }, []);

  const handleRunSchedulerClick = () => {
    if (wasm) {

      const tasks = [
        { runtime: 10, tickets: 5 },
        { runtime: 15, tickets: 3 },
        { runtime: 20, tickets: 2 },
      ];
      const executionSpeed = 1;
      const schedulingQuantum = 2;

      const schedulerResultHandle = wasm.runLotteryScheduler(tasks.length, executionSpeed, schedulingQuantum, tasks);
  
      const resultArray = [];
      for (let i = 0; i < schedulerResultHandle.size(); i++) {
        resultArray.push(schedulerResultHandle.get(i));
      }
      setResults(resultArray);
    }
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <h2>Lottery Scheduler Simulation</h2>
        <button onClick={handleRunSchedulerClick}>Run Scheduler</button>
        {results.map((result, index) => (
          <div key={index}>{result}</div>
        ))}
      </header>
    </div>
  );
  
}

export default App;