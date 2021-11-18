require("dotenv").config();
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const callSendAPI = (sender_psid, response) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  request(
    {
      uri: "https://graph.facebook.com/v12.0/me/messages",
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
};

const handleGetStarted = (sender_psid) => {
  return Promise(async (resolve, reject) => {
    try {
      const res = { text: "OK, Xin chào mừng bạn XXX đến với MW Store" };
      await callSendAPI(sender_psid, res);
      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleGetStarted,
};
