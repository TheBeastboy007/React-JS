import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const increaseCount = () => {
    count < 20 ? setCount(count + 1) : alert("Maximum limit reached");
  };

  const decreaseCount = () => {
    count > 0 ? setCount(count - 1) : alert("Minimum limit reached");
  };

  return (
    <>
      <h1>Counter : {count}</h1>

      <button onClick={increaseCount}>Add Value : {count}</button>
      <br />
      <button onClick={decreaseCount}>Decrease Value : {count}</button>
    </>
  );
}

export default App;
