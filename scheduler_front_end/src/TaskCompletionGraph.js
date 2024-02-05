// TaskCompletionGraph.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TaskCompletionGraph = ({ tasks, results }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (tasks.length && results.length && d3Container.current) {
      // Clear the container each time this effect runs
      d3.select(d3Container.current).selectAll('*').remove();

      const margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

      // Append the svg object to the container div
      const svg = d3.select(d3Container.current)
        .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create scales
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(results, (_, i) => i)])   // Domain from 0 to number of results
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
    const taskCompletionData = tasks.map((task, taskIndex) => {
        return results.map((_, resultIndex) => {
          // Assuming that results is an array of the total runtime completed for each task at each tick
          const completion = (results[resultIndex][taskIndex] / task.runtime) * 100;
          return { time: resultIndex, completion: Math.min(completion, 100) }; // Cap at 100%
        });
      });

      // Draw lines
taskCompletionData.forEach((data, index) => {
    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.completion));
  
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colorScale(index))
      .attr('stroke-width', 2)
      .attr('d', line);
  });

      // Legend
      const legend = svg.selectAll('.legend')
        .data(tasks)
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0,${i * 20})`);

      legend.append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', (d, i) => colorScale(i));

      legend.append('text')
        .attr('x', width - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text((d, i) => `Task ${i+1}`);
    }
  }, [tasks, results]);

  return (
    <div className="TaskCompletionGraph" ref={d3Container} />
  );
};

export default TaskCompletionGraph;
