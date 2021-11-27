require("dotenv").config();
import express from "express";
import http from "http";
import viewEngine from "./configs/viewEngine";
import webRoutes from "./routes/web";
import cors from "cors";
import ChatRealtime from "./services/ChatRealtime";
const corsConfig = {
  credentials: true,
  origin: true,
};

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: corsConfig });
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cors(corsConfig));

viewEngine(app);
webRoutes(app);
ChatRealtime(io);

server.listen(PORT, () => {
  console.log("App is running at the port: ", PORT);
});
