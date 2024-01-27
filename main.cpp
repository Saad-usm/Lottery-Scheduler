#include "InputHandler.h"
#include <iostream>
#include <random>
#include <chrono>
#include <thread>

int main() {
    int totalTickets, executionSpeed, schedulingQuantum;
    std::vector<Task> tasks = getInput(totalTickets, executionSpeed, schedulingQuantum);


    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, totalTickets);
    while (totalTickets > 0) {
        int selectedTicket = dis(gen);
        int ticketCount = 0;

        for (auto& task : tasks) {
            ticketCount += task.tickets;
            if (selectedTicket <= ticketCount && task.runtime > 0) {
                std::cout << "Scheduling Quantum: " << schedulingQuantum << "s, Selected Ticket: " << selectedTicket << ", Running Task: " << (&task - &tasks[0]) + 1 << std::endl;
                task.runtime -= schedulingQuantum;

                if (executionSpeed > 0) {
                    // Calculate the sleep duration based on the execution speed
                    std::this_thread::sleep_for(std::chrono::milliseconds(1000 / executionSpeed));
                }

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

