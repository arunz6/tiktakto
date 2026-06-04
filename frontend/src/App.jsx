import { useState } from "react";
import "./App.css";
import Togle from "./feature/togle/Togle";
import Gamepage from "./feature/game/Gamepage";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Togle />
    </>
  );
}

export default App;
