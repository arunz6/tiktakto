import { useState, useEffect } from "react";
import "./App.css";
import Togle from "./feature/togle/Togle";
import socket from "./feature/service/socket";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });
  }, []);

  return (
    <>
      <Togle />
    </>
  );
}

export default App;
