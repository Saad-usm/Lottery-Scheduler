#include "InputHandler.h"
#include <iostream>

std::vector<Task> getInput(int& totalTickets, int& executionSpeed, int& schedulingQuantum) {
    int numberOfTasks;
    std::cout << "Enter the number of tasks: ";
    std::cin >> numberOfTasks;

    std::vector<Task> tasks(numberOfTasks);
    totalTickets = 0;

    for (int i = 0; i < numberOfTasks; ++i) {
        std::cout << "Enter runtime and tickets for task " << i + 1 << ": ";
        std::cin >> tasks[i].runtime >> tasks[i].tickets;
        totalTickets += tasks[i].tickets;
    }

    std::cout << "Enter execution speed (1 for real-time, 0 for as fast as possible): ";
    std::cin >> executionSpeed;

    std::cout << "Enter scheduling quantum (in seconds): ";
    std::cin >> schedulingQuantum;

    return tasks;
}
