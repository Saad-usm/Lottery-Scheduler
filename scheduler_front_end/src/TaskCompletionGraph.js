// TaskCompletionGraph.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TaskCompletionGraph = ({ tasks, results }) => {
  const d3Container = useRef(null);
  const margin = { top: 10, right: 30, bottom: 30, left: 60 };
  const width = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  useEffect(() => {
    if (tasks.length && results.length && d3Container.current) {
      let svg = d3.select(d3Container.current).select('svg');
      if (svg.empty()) {
        svg = d3.select(d3Container.current)
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);
      }

      // Create scales
      const xScale = d3.scaleLinear()
        .domain([0, results.length - 1])   // Domain from 0 to the last index of results
        .range([0, width]);
      
      const yScale = d3.scaleLinear()
        .domain([0, 100])   // Completion percentage from 0 to 100
        .range([height, 0]);

      // Add X axis
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      // Add Y axis
      svg.append('g')
        .call(d3.axisLeft(yScale));

      // Colors for the tasks
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      // Compute the percentage of task completion over time
      tasks.forEach((task, taskIndex) => {
        // Assuming each entry in `results` is an array with the task's current completion
        const taskData = results.map((resultTick, i) => ({
          time: i,
          completion: (resultTick[taskIndex] / task.runtime) * 100,
        })).filter(d => !isNaN(d.completion));  // Filter out NaN values

        // Create the line generator
        const line = d3.line()
          .x(d => xScale(d.time))
          .y(d => yScale(d.completion));

        // Update the line
        svg.selectAll(`.line-task-${taskIndex}`)
          .data([taskData])
          .join(
            enter => enter
              .append('path')
              .attr('class', `line line-task-${taskIndex}`)
              .attr('d', line)
              .attr('fill', 'none')
              .attr('stroke', colorScale(taskIndex))
              .attr('stroke-width', 2),
            update => update
              .attr('d', line),
            exit => exit.remove()
          );
      });

      // Add legend
      const legendContainer = svg.selectAll('.legend-container').data([null]);
      const legendContainerEnter = legendContainer.enter().append('g').attr('class', 'legend-container');

      const legend = legendContainerEnter.merge(legendContainer)
        .selectAll('.legend')
        .data(tasks);

      const legendEnter = legend.enter().append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0,${i * 20})`);

      legendEnter.append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .merge(legend.select('rect'))
        .style('fill', (d, i) => colorScale(i));

      legendEnter.append('text')
        .attr('x', width - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .merge(legend.select('text'))
        .text((d, i) => `Task ${i + 1}`);

      legend.exit().remove();

    }
  }, [tasks, results, height, width, margin]);

  return (
    <div className="TaskCompletionGraph" ref={d3Container} />
  );
};

export default TaskCompletionGraph;
