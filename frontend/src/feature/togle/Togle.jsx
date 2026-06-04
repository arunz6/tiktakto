import { useState } from "react";
import Chat from "../chat/Chat";
import Gamepage from "../game/Gamepage";

function App() {
  const [input, setInput] = useState("");
  const [page, setPage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input === "25.09") {
      setPage("chat");
    } else {
      setPage("game");
    }
  };

  if (page === "chat") {
    return <Chat />;
  }

  if (page === "game") {
    return <Gamepage nameofuser={input} />;
  }

  return (
    <>
      <div className="h-screen w-screen flex justify-center flex-col gap-8 text-white  items-center bg-black   ">
        <div className="">
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight text-white">
              <span className="text-rose-400">Tic</span>
              <span className="text-zinc-500"> × </span>
              <span className="text-sky-400">Tac</span>
              <span className="text-zinc-500"> × </span>
              <span className="text-white">Toe</span>
            </h1>
          </div>
        </div>
        <div className="text-center flex flex-col gap-4">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter code"
            />

            <button
              className="px-4 py-2 bg-blue-500 text-white font-extrabold uppercase rounded-lg hover:bg-blue-600 transition duration-300"
              type="submit"
            >
              Start
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
