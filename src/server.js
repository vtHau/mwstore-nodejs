import express from "express";
import http from "http";
import viewEngine from "./configs/viewEngine";
import webRoutes from "./routes/web";
import cors from "./configs/cors";
import ChatRealtime from "./services/ChatRealtime";

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const PORT = 8080;

app.use(express.json());
app.use(cors);

viewEngine(app);
webRoutes(app);
ChatRealtime(io);

server.listen(PORT, () => {
  console.log("App is running at the port: ", PORT);
});
