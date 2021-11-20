require("dotenv").config();
import request from "request";
import productApi from "../apis/productApi";
import ChatbotService from "./../services/ChatbotService";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

const postWebhook = (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
};

const handleMessage = (sender_psid, received_message) => {
  if (received_message.text) {
    ChatbotService.handleChatSimsimi(sender_psid);
  } else if (received_message.attachments) {
    ChatbotService.handleSendAttachments(sender_psid, received_message);
  }
};

const handlePostback = async (sender_psid, received_postback) => {
  let response;

  const payload = received_postback.payload;

  switch (payload) {
    case "yes":
      response = { text: "Thanks!" };
      break;

    case "no":
      response = { text: "Oops, try sending another image." };
      break;

    case "RESTART":
    case "GET_STARTED":
      await ChatbotService.handleGetStarted(sender_psid);
      break;

    case "PRODUCT_LIST":
      await ChatbotService.handleProductList(sender_psid);
      break;

    case "PRODUCT_NEW":
      await ChatbotService.handleProductNew(sender_psid);
      break;

    case "PRODUCT_VIEW":
      await ChatbotService.handleProductView(sender_psid);
      break;

    case "PRODUCT_FEATHER":
      await ChatbotService.handleProductFeather(sender_psid);
      break;

    default:
      response = { text: `Xin lỗi, Chúng tôi không biết ${payload} là gì` };
  }
};

const setupProfile = async (req, res) => {
  let request_body = {
    get_started: { payload: "GET_STARTED" },
    whitelisted_domains: ["https://mwstore-nodejs.herokuapp.com/"],
  };

  await request(
    {
      uri: `https://graph.facebook.com/v12.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );

  return res.send("Setup profile success");
};

const setupPersistent = async (req, res) => {
  let request_body = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "web_url",
            title: "Đi tới website",
            url: "https://www.facebook.com/MW-Store-108345978337846",
            webview_height_ratio: "full",
          },
          {
            type: "web_url",
            title: "Facebook page",
            url: "https://www.facebook.com/MW-Store-108345978337846",
            webview_height_ratio: "full",
          },
          {
            type: "postback",
            title: "Bắt đầu",
            payload: "RESTART",
          },
        ],
      },
    ],
  };

  await request(
    {
      uri: `https://graph.facebook.com/v12.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("Setup persistent succes");
      } else {
        console.error("Err: " + err);
      }
    }
  );

  return res.send("Setup persistent succes");
};

module.exports = {
  getWebhook,
  postWebhook,
  setupProfile,
  setupPersistent,
};
