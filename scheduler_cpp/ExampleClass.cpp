#include <emscripten/bind.h>

class ExampleClass {
public:
    ExampleClass(int x) : x(x) {}
    int getX() const { return x; }
    void setX(int x) { this->x = x; }

private:
    int x;
};

EMSCRIPTEN_BINDINGS(example_module) {
    emscripten::class_<ExampleClass>("ExampleClass")
        .constructor<int>()
        .function("getX", &ExampleClass::getX)
        .function("setX", &ExampleClass::setX);
}
 