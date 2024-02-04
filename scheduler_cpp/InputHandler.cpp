#include "InputHandler.h"
#include <iostream>

// Function to get input from the user.
// This function will prompt the user for the number of tasks,
// their runtimes, tickets, execution speed, and scheduling quantum.
std::vector<Task> getInput(int& totalTickets, int& executionSpeed, int& schedulingQuantum) {
    int numberOfTasks;
    std::cout << "Enter the number of tasks: ";
    std::cin >> numberOfTasks;

    std::vector<Task> tasks(numberOfTasks);
    totalTickets = 0;

    // Loop to get runtime and tickets for each task
    for (int i = 0; i < numberOfTasks; ++i) {
        std::cout << "Enter runtime and tickets for task " << i + 1 << ": ";
        std::cin >> tasks[i].runtime >> tasks[i].tickets;
        totalTickets += tasks[i].tickets;
    }

    // Get the execution speed from the user
    std::cout << "Enter execution speed (number of quanta per second, 0 for as fast as possible): ";
    std::cin >> executionSpeed;

    // Get the scheduling quantum from the user
    std::cout << "Enter scheduling quantum (in seconds): ";
    std::cin >> schedulingQuantum;

    return tasks;
}
