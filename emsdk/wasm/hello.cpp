#include <emscripten/bind.h>
using namespace emscripten;

class Calculator {
public:
 Calculator() {}
    static int add(int a, int b) {
        return a + b;
    }
};

EMSCRIPTEN_BINDINGS(my_module){
    class_<Calculator>("Calculator")
        .constructor()
        .class_function("add", &Calculator::add);
}
