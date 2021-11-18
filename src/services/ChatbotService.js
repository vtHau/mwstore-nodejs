require("dotenv").config();
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_STARTED =
  "https://luv.vn/wp-content/uploads/2021/08/hinh-anh-gai-xinh-52.jpg";

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

const getUserName = (sender_psid) => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
        method: "GET",
      },
      (err, res, body) => {
        if (!err) {
          const { last_name, first_name } = JSON.parse(body);
          const username = `${last_name} ${first_name}`;
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
      const resText = {
        text: `OK, Xin chào mừng bạn ${username} đến với MW Store`,
      };
      await callSendAPI(sender_psid, resText);

      const resTemplate = sendGetStartedTemplate();
      await callSendAPI(sender_psid, resTemplate);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

const sendGetStartedTemplate = () => {
  const response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Xin chào bạn đến với MW Store",
            subtitle: "Dưới đây là cái lựa cho của nhà hàng.",
            image_url: IMAGE_STARTED,
            buttons: [
              {
                type: "postback",
                title: "Menu Chính!",
                payload: "MAIN_MENU",
              },
              {
                type: "postback",
                title: "Đặt bàn!",
                payload: "RESERVE_TABLE",
              },
              {
                type: "postback",
                title: "Hướng dẫn sử dụng!",
                payload: "GUIDE_TO",
              },
            ],
          },
        ],
      },
    },
  };

  return response;
};

const handleSendMainMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resTemplate = getMainMenuTemplate();
      await callSendAPI(sender_psid, resTemplate);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

const getMainMenuTemplate = () => {
  const response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "ăn trửa",
            subtitle: "Dưới đây là cái lựa cho của nhà hàng.",
            image_url: IMAGE_STARTED,
            buttons: [
              {
                type: "postback",
                title: "Bũa trưa!",
                payload: "LUNCH_MENU",
              },
              {
                type: "postback",
                title: "Bữa tối!",
                payload: "DINNER_MENU",
              },
            ],
          },
          {
            title: "đặt bàn",
            subtitle: "Dưới đây là cái lựa cho của nhà hàng.",
            image_url: IMAGE_STARTED,
            buttons: [
              {
                type: "postback",
                title: "Đặt bàn!",
                payload: "RESERVE_TABLE",
              },
            ],
          },
          {
            title: "khong gian nha hang",
            subtitle: "day la khong gian hang",
            image_url: IMAGE_STARTED,
            buttons: [
              {
                type: "postback",
                title: "Menu Chính!",
                payload: "SHOW_ROOM",
              },
            ],
          },
        ],
      },
    },
  };

  return response;
};

module.exports = {
  handleGetStarted,
  handleSendMainMenu,
};
