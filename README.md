Lottery Scheduler Implementation based on https://www.usenix.org/legacy/publications/library/proceedings/osdi/full_papers/waldspurger.pdf

LIVE DEMO: https://www.lotteryscheduler.me

Command to compile: 

source ./emsdk_env.sh

em++ -o ./wasm/scheduler.js -lembind -s SINGLE_FILE=1 -s MODULARIZE=1 -s EXPORT_ES6=0 -s WASM=1 -s ENVIRONMENT=web ./wasm/scheduler.cpp
