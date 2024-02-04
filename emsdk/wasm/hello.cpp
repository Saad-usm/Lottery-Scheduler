#include <emscripten/bind.h>
#include <vector>
#include <random>
#include <string>
#include <sstream>

using namespace emscripten;

struct Task {
    int runtime;
    int tickets;
    Task(int runtime, int tickets) : runtime(runtime), tickets(tickets) {}
};

std::vector<std::string> runLotteryScheduler(
    int numberOfTasks,
    int executionSpeed,
    int schedulingQuantum,
    const val &tasksVal
) {
    std::vector<Task> tasks;

    for (unsigned int i = 0; i < numberOfTasks; ++i) {
        val taskVal = tasksVal[i];
        tasks.push_back(Task(taskVal["runtime"].as<int>(), taskVal["tickets"].as<int>()));
    }

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
                ss << "Scheduling Quantum: " << schedulingQuantum << "s, Selected Ticket: " 
                   << selectedTicket << ", Running Task: " << i + 1;
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

// Binding code to expose the runLotteryScheduler function and the Task struct to JavaScript
EMSCRIPTEN_BINDINGS(my_module) {
    class_<Task>("Task")
        .constructor<int, int>()
        .property("runtime", &Task::runtime)
        .property("tickets", &Task::tickets);

    register_vector<std::string>("VectorString");
    function("runLotteryScheduler", &runLotteryScheduler, allow_raw_pointers());
}