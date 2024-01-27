#ifndef TASK_H
#define TASK_H

#include <vector>

// Definition of the Task struct.
// Each task has a runtime and a number of tickets associated with it.
struct Task {
    int runtime;
    int tickets;
};

// Function declarations
std::vector<Task> getInput(int& totalTickets, int& executionSpeed, int& schedulingQuantum);

#endif // TASK_H
