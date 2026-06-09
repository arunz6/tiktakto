import React, { useEffect, useState } from "react";
import Gamepage from "../game/Gamepage";
import socket from "../service/socket";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [showGame, setShowGame] = useState(false);
  let [messages, setMessages] = useState("");
  const getMessages = async () => {
    const res = await axios.get("http://localhost:3000/api/message/all");

    console.log(res.data.data);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);




  const sendMessage = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/message/send", {
        sender: "Arun",
        content: message,
        avatar: "",
      });

      console.log(res.data);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  async function formsubmit(e) {
    e.preventDefault();

    const data = {
      sender: "Arun",
      content: message,
    };

    socket.emit("send_message", data);

    setMessage("");
  }

  if (showGame) {
    return <Gamepage />;
  }

  return (
    <div className="relative overflow-hidden bg-black h-screen w-screen text-white">
      <div className="flex flex-col gap-2">
        {messages.map((msg) => (
          <div key={msg._id} className="bg-zinc-800 p-3 rounded-lg">
            <p>{msg.sender}</p>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowGame(true)}
        onDoubleClick={() => setShowGame(true)}
        className="fixed bottom-24 right-4 md:bottom-28 md:right-6
               bg-green-600 hover:bg-green-700
               text-white rounded-full
               w-14 h-14 md:w-16 md:h-16
               shadow-xl transition-all duration-300"
      >
        game
      </button>
      <div className=" fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-700 p-3">
        <form className="flex items-center gap-2" onSubmit={formsubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-medium transition duration-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
