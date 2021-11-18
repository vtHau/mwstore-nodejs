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

const getUserName = async (sender_psid) => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=<PAGE_ACCESS_TOKEN>`,
        method: "GET",
      },
      (err, res, body) => {
        if (!err) {
          const resp = JSON.parse(body);
          const username = `${resp.last_name} ${resp.first_name}`;
          resolve(username);
        } else {
          reject(err);
        }
      }
    );
  });
};

const handleGetStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const username = await getUserName(sender_psid);
      const res = {
        text: `OK, Xin chào mừng bạn ${username} đến với MW Store`,
      };
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
