#include <emscripten/bind.h>
#include <vector>
#include <random>
#include <string>
#include <sstream>

using namespace emscripten;

// Define a struct for tasks. Each task has a runtime and tickets associated with it.
struct Task {
    int runtime;
    int tickets;
    // Constructor to initialize a Task object with a runtime and number of tickets.
    Task(int runtime, int tickets) : runtime(runtime), tickets(tickets) {}
};

// Function to simulate a lottery scheduler for task execution.
// It takes the number of tasks, execution speed (not used in the code), scheduling quantum, and a JS array of tasks.
std::vector<std::string> runLotteryScheduler(
    int numberOfTasks,
    int executionSpeed, // Note: This parameter is unused in the function.
    int schedulingQuantum,
    const val &tasksVal
) {
    std::vector<Task> tasks;

    // Convert the JavaScript array of tasks into a C++ vector of Task structs.
    for (unsigned int i = 0; i < numberOfTasks; ++i) {
        val taskVal = tasksVal[i];
        tasks.push_back(Task(taskVal["runtime"].as<int>(), taskVal["tickets"].as<int>()));
    }

    // Vector to store the results of the scheduling simulation.
    std::vector<std::string> results;
    int totalTickets = 0;
    // Calculate the total number of tickets.
    for (const auto& task : tasks) {
        totalTickets += task.tickets;
    }

    // Setup random number generation for selecting a winning ticket.
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, totalTickets);

    // Continue scheduling tasks until all tickets have been processed.
    while (totalTickets > 0) {
        int selectedTicket = dis(gen); // Randomly select a winning ticket.
        int ticketCount = 0;

        // Iterate through tasks to find the task with the winning ticket.
        for (size_t i = 0; i < tasks.size(); ++i) {
            ticketCount += tasks[i].tickets;
            if (selectedTicket <= ticketCount && tasks[i].runtime > 0) {
                std::stringstream ss;
                ss << "Scheduling Quantum: " << schedulingQuantum << "s, Selected Ticket: "
                   << selectedTicket << ", Running Task: " << i + 1;
                results.push_back(ss.str());

                // Deduct the quantum from the task's runtime.
                tasks[i].runtime -= schedulingQuantum;

                // If the task's runtime is depleted, remove its tickets from the total.
                if (tasks[i].runtime <= 0) {
                    totalTickets -= tasks[i].tickets;
                    tasks[i].tickets = 0;
                }
                break; // Exit the loop to simulate the scheduling of one task per quantum.
            }
        }
    }

    results.push_back("Execution done.");
    return results;
}

// Binding code to make the runLotteryScheduler function and the Task struct accessible from JavaScript.
EMSCRIPTEN_BINDINGS(my_module) {
    class_<Task>("Task")
        .constructor<int, int>()
        .property("runtime", &Task::runtime)
        .property("tickets", &Task::tickets);

    register_vector<std::string>("VectorString");
    function("runLotteryScheduler", &runLotteryScheduler, allow_raw_pointers());
}
