import express from "express";
import HomeController from "./../controllers/HomeController";
import NotificationController from "./../controllers/NotificationController";
import ChatbotController from "./../controllers/ChatbotController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", HomeController.getHomePage);

  router.post("/notification", NotificationController.sendNotification);

  router.get("/webhook", ChatbotController.getWebhook);
  router.post("/webhook", ChatbotController.postWebhook);
  router.get("/setup-profile", ChatbotController.setupProfile);
  router.get("/setup-persistent", ChatbotController.setupPersistent);

  return app.use("/", router);
};

export default initWebRoutes;
