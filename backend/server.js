import app from "./src/app.js";
import config from "./src/config/config.js";
import connecttodb from "./src/config/connecttodb.js";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

app.use(cors()); 

connecttodb();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected"+socket.id);
});

httpServer.listen(config.port, () => {
  console.log("server is runnging on" + config.port);
});
