#include <vector>
#include <random>
#include <string>
#include <sstream> // For string stream
#include <iostream>

// Definition of the Task struct.
struct Task {
    int runtime;
    int tickets;
};

// Simulation function declaration
std::vector<std::string> runLotteryScheduler(
    const std::vector<Task>& tasksInput,
    int executionSpeed,
    int schedulingQuantum);

// Simulation function implementation
std::vector<std::string> runLotteryScheduler(
    const std::vector<Task>& tasksInput,
    int executionSpeed,
    int schedulingQuantum) {
    
    std::vector<Task> tasks = tasksInput; // Copy tasks to modify runtime
    std::vector<std::string> results;
    int totalTickets = 0;
    for (const auto& task : tasks) {
        totalTickets += task.tickets;
    }

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, totalTickets);

    while (totalTickets > 0) {
        int selectedTicket = dis(gen);
        int ticketCount = 0;

        for (size_t i = 0; i < tasks.size(); ++i) {
            ticketCount += tasks[i].tickets;
            if (selectedTicket <= ticketCount && tasks[i].runtime > 0) {
                std::stringstream ss;
                ss << "Scheduling Quantum: " << schedulingQuantum << "s, Selected Ticket: " << selectedTicket
                   << ", Running Task: " << i + 1;
                results.push_back(ss.str());

                tasks[i].runtime -= schedulingQuantum;

                if (tasks[i].runtime <= 0) {
                    totalTickets -= tasks[i].tickets;
                    tasks[i].tickets = 0;
                }
                break; // Move to the next lottery round
            }
        }
    }

    results.push_back("Execution done.");
    return results;
}

int main() {
    std::vector<Task> tasksInput = {
    {10, 5}, // Task 1: runtime 10s, 5 tickets
    {15, 3}, // Task 2: runtime 15s, 3 tickets
    {20, 40}  // Task 3: runtime 20s, 2 tickets
};

    int executionSpeed = 1; // Ignored in this static example
    int schedulingQuantum = 2;

    auto simulationResults = runLotteryScheduler(tasksInput, executionSpeed, schedulingQuantum);

    for (const auto& result : simulationResults) {
        std::cout << result << std::endl;
    }
}
