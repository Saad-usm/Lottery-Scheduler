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

  const [cpuColor, setCpuColor] = useState('black'); // State to manage the CPU image color


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

  useEffect(() => {
    let colorChangeInterval;
    if (simulationStatus === 'running') {
      // Change the CPU image color every 500ms
      colorChangeInterval = setInterval(() => {
        setCpuColor((prevColor) => (prevColor === 'black' ? 'red' : 'black'));
      }, 500);
    } else {
      clearInterval(colorChangeInterval);
      setCpuColor('black'); // Reset color to default when the simulation is not running
    }

    return () => clearInterval(colorChangeInterval);
  }, [simulationStatus]);

  // JSX to render the UI components
  return (
    <div className="App">
      <header className="App-header">
      <img src="cpu-clipart.png" width="100" alt="CPU" style={{ filter: `hue-rotate(${cpuColor === 'red' ? '0deg' : '90deg'})`, padding: "20px" }} />
        <h3 style={{ marginTop: '0', marginBottom: '20px' }}>Implementation and visualization of a CPU scheduler as described by Waldspurger and Weihl <a href="https://www.usenix.org/legacy/publications/library/proceedings/osdi/full_papers/waldspurger.pdf" target="_blank" rel="noopener noreferrer">here</a>. Based on a lottery algorithm written in C++ and compiled to Wasm.</h3>
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
            tasks={tasks}
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
