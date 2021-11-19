import express from "express";
import HomeController from "./../controllers/HomeController";
import ChatbotController from "./../controllers/ChatbotController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", HomeController.getHomePage);
  router.get("/test-db", HomeController.testDB);
  router.get("/testapi", HomeController.testApi);

  router.get("/webhook", ChatbotController.getWebhook);
  router.post("/webhook", ChatbotController.postWebhook);
  router.post("/setup-profile", ChatbotController.setupProfile);
  router.post("/setup-persistent", ChatbotController.setupPersistent);

  return app.use("/", router);
};

export default initWebRoutes;
