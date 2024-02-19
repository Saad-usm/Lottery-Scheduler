// Import necessary React hooks and styles
import React, { useState, useEffect } from 'react';
import './App.css';

// Import the WebAssembly scheduler module
import schedulerModule from './wasm/scheduler';

// Import Chart.js and its components for creating line charts
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

import TaskManager from './TaskManager';
import SchedulerControls from './SchedulerControls';

// Register Chart.js components for use in charts
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  // State for storing the results from the scheduler
  const [results, setResults] = useState([]);
  // State for storing results that are currently displayed
  const [displayedResults, setDisplayedResults] = useState([]);
  // State for the scheduler module instance
  const [scheduler, setScheduler] = useState(null);
  // State for tasks to be scheduled, initialized with a default task
  const [tasks, setTasks] = useState([{ runtime: 10, tickets: 5 }]);
  // State for the quantum (time slice) used in the scheduling algorithm
  const [schedulingQuantum, setSchedulingQuantum] = useState(2);
  // State for tracking the simulation status (stopped, running, paused)
  const [simulationStatus, setSimulationStatus] = useState('stopped');
  // State for tracking the percentage of completion of the simulation
  const [completionPercentages, setCompletionPercentages] = useState(tasks.map(() => []));



  // Effect hook to initialize the scheduler module on component mount
  useEffect(() => {
    schedulerModule().then((module) => {
      setScheduler(module);
    });
  }, []);

   // Update the `completionPercentages` state whenever tasks change
   useEffect(() => {
    setCompletionPercentages(tasks.map(() => []));
  }, [tasks]);

  // Assume this useEffect is added to your component
  useEffect(() => {
    if (displayedResults.length > 0 && tasks.length > 0) {
      // Track the cumulative runtime allocated to each task
      let taskRuntimes = new Array(tasks.length).fill(0);
      // Prepare a structure to hold the progressive completion percentages for each task
      let progressiveCompletion = tasks.map(() => []);
  
      displayedResults.forEach((result, index) => {
        const match = result.match(/Running Task: (\d+)/);
        if (match) {
          const taskId = parseInt(match[1], 10) - 1; // Adjust for zero-based indexing
          taskRuntimes[taskId] += schedulingQuantum; // Increment the allocated runtime for the task
  
          // Calculate the new completion percentage for each task
          tasks.forEach((task, i) => {
            const completed = taskRuntimes[i];
            const totalRuntime = tasks[i].runtime;
            const completionPercentage = totalRuntime > 0 ? Math.min((completed / totalRuntime) * 100, 100) : 100;
            // Append the new percentage to the progressive completion array for the task
            // If it's the first result, just set it, otherwise calculate the new value
            if (index === 0) {
              progressiveCompletion[i].push(completionPercentage);
            } else {
              // Ensure not to exceed 100%
              const lastPercentage = progressiveCompletion[i].length > 0 ? progressiveCompletion[i][progressiveCompletion[i].length - 1] : 0;
              progressiveCompletion[i].push(Math.max(completionPercentage, lastPercentage));
            }
          });
        }
      });
  
      // Update the completionPercentages state with the new progressive completion arrays
      setCompletionPercentages(progressiveCompletion.map((percentages, index) => percentages));
    }
  }, [displayedResults, tasks, schedulingQuantum]);
  
  
  


  const updateSimulationProgress = () => {
    // Simulated progress update for demonstration; customize based on your scheduler's logic
    setCompletionPercentages(prevPercentages =>
      prevPercentages.map((percentages, index) => {
        const nextValue = Math.min(percentages.length + (100 / tasks.length), 100);
        return [...percentages, nextValue];
      })
    );

    // Stop simulation when all tasks reach 100% (simplified check)
    if (completionPercentages.every(percentages => percentages.at(-1) === 100)) {
      setSimulationStatus('stopped');
    }
  };

  // Function to start the scheduler simulation
  const handleRunSchedulerClick = () => {
    if (scheduler && simulationStatus !== 'running') {
      // Run the scheduler and store the results
      const schedulerResultHandle = scheduler.runLotteryScheduler(tasks.length, 1, schedulingQuantum, tasks);
      const resultArray = [];
      for (let i = 0; i < schedulerResultHandle.size(); i++) {
        resultArray.push(schedulerResultHandle.get(i));
      }
      setResults(resultArray);
      console.log(resultArray);
      setDisplayedResults([]);
      setSimulationStatus('running');
    }
  };

  // Function to update task details
  const handleTaskChange = (index, field, value) => {
    const newTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, [field]: Number(value) };
      }
      return task;
    });
    setTasks(newTasks);
  };

  // Function to add a new task
  const handleAddTask = () => {
    setTasks([...tasks, { runtime: 0, tickets: 0 }]);
  };

  // Function to toggle simulation status
  const toggleSimulation = () => {
    if (simulationStatus === 'stopped') {
      // setPercentageCompletion([]); // Reset progress on start
      handleRunSchedulerClick();
    } else {
      setSimulationStatus(currentStatus =>
        currentStatus === 'running' ? 'paused' : 'running'
      );
    }
  };

  // Function to stop the simulation
  const stopSimulation = () => {
    setSimulationStatus('stopped');
    setDisplayedResults([]);
    setResults([]);
    // setPercentageCompletion([]);
  };

  // Adjust the data for the chart to map each task to a dataset
  const data = {
    labels: [...Array(results.length).keys()].map(i => `Quantum ${i + 1}`),
    datasets: completionPercentages.map((percentages, index) => ({
      label: `Task ${index + 1} Completion (%)`,
      data: percentages.map(percentage => percentage), // Use the calculated progress for each task
      fill: false,
      borderColor: `hsl(${360 * (index / tasks.length)}, 70%, 50%)`, // Color each line differently
      tension: 0.1,
    })),
  };
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 100,
      },
    },
    maintainAspectRatio: false,
  };

  // Function to remove a task
  const handleRemoveTask = (indexToRemove) => {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  };

  // JSX to render the UI components
  return (
    <div className="App">
      <header className="App-header">
        <h2>Lottery Scheduler Simulation</h2>
        <div className="App-content" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: '20px' }}>
        <TaskManager tasks={tasks} handleTaskChange={handleTaskChange} handleAddTask={handleAddTask} handleRemoveTask={handleRemoveTask} />
        <SchedulerControls 
            schedulingQuantum={schedulingQuantum} 
            setSchedulingQuantum={setSchedulingQuantum} 
            simulationStatus={simulationStatus} 
            toggleSimulation={toggleSimulation} 
            stopSimulation={stopSimulation} 
            displayedResults={displayedResults} 
            setDisplayedResults={setDisplayedResults} 
            results={results} 
          />
          <div style={{ width: '600px', height: '400px' }}>
            <Line data={data} options={options}/>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
