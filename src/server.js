import express from "express";
import viewEngine from "./configs/viewEngine";
import webRoutes from "./routes/web";
import connectDB from "./configs/db";

const app = express();

app.use(express.json());

viewEngine(app);
webRoutes(app);
// connectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("App is running at the port: ", PORT);
});
