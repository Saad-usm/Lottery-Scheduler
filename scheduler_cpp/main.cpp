#include "InputHandler.h"
#include <iostream>
#include <random>
#include <chrono>
#include <thread>

int main() {
    int totalTickets, executionSpeed, schedulingQuantum;
    // Get input from the user (tasks, execution speed, and quantum)
    std::vector<Task> tasks = getInput(totalTickets, executionSpeed, schedulingQuantum);

    // Setting up the random number generator
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, totalTickets);

    // Main loop of the lottery scheduler
    while (totalTickets > 0) {
        // Draw a random ticket
        int selectedTicket = dis(gen);
        int ticketCount = 0;

        // Iterate through tasks to find the task corresponding to the drawn ticket
        for (auto& task : tasks) {
            ticketCount += task.tickets;
            if (selectedTicket <= ticketCount && task.runtime > 0) {
                std::cout << "Scheduling Quantum: " << schedulingQuantum << "s, Selected Ticket: " << selectedTicket << ", Running Task: " << (&task - &tasks[0]) + 1 << std::endl;
                task.runtime -= schedulingQuantum;

                // Handle execution speed (delay) if specified
                if (executionSpeed > 0) {
                    std::this_thread::sleep_for(std::chrono::milliseconds(1000 / executionSpeed));
                }

                // Check if the task is completed
                if (task.runtime <= 0) {
                    totalTickets -= task.tickets;
                    task.tickets = 0;
                }
                break;
            }
        }
    }

    std::cout << "Execution done." << std::endl;
    return 0;
}
