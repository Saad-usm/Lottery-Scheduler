import React, { useState } from 'react';
import Hello from './wasm/hello';
import './App.css';


function App() {
  const [text, setText] = useState();
  let wasm;
  let a = 1;
  let b = 2;
  Hello().then((module) => {
    wasm = module;
  });

  const handleHelloClick = () => {
    if (wasm) {
      const instance = new wasm.Calculator();
      setText(wasm.Calculator.add(a, b));
      console.log("test");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Test.</h2>
        <button onClick={handleHelloClick}>Hello WASM</button>
        <h4>{text}</h4>
      </header>
    </div>
  );
}

export default App;
