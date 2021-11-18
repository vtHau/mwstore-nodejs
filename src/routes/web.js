import express from "express";
import HomeController from "./../controllers/HomeController";
import ChatbotController from "./../controllers/ChatbotController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", HomeController.getHomePage);

  router.get("/webhook", ChatbotController.getWebhook);
  router.post("/webhook", ChatbotController.postWebhook);
  router.post("/setup-profile", ChatbotController.setupProfile);
  router.post("/setup-persistent", ChatbotController.setupPersistent);

  return app.use("/", router);
};

module.exports = initWebRoutes;

// curl -X GET "localhost:8080/webhook?hub.verify_token=trunghau&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
// curl -H "Content-Type: application/json" -X POST "https://mwstore-nodejs.herokuapp.com/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'
