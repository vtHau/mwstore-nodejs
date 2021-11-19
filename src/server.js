import express from "express";
import viewEngine from "./configs/viewEngine";
import webRoutes from "./routes/web";
import cors from "./configs/cors";

const app = express();

app.use(express.json());
app.use(cors);

viewEngine(app);
webRoutes(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("App is running at the port: ", PORT);
});
