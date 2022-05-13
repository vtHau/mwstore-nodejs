require("dotenv").config();
import request from "request";
import productApi from "../apis/productApi";
import OcrService from "./OcrService";
import * as PATH_URL from "./../constants/apiUrl";
import { formatPrice } from "./../helpers/formats";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_STARTED =
  "https://ipicorp.co/wp-content/uploads/2020/05/Shopping-cart-6-tips-to-design-it-and-take-your-checkouts-to-the-next-level.png";

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

const sendGetStartedTemplate = () => {
  const response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Xin chào bạn đến với MW Store",
            subtitle: "Mời bạn chọn chức năng",
            image_url: IMAGE_STARTED,
            buttons: [
              {
                type: "postback",
                title: "Sản phẩm",
                payload: "PRODUCT_LIST",
              },
              {
                type: "web_url",
                title: "Liên hệ & Giới thiệu",
                url: "https://www.mwstore.xyz/contact",
                webview_height_ratio: "full",
              },
            ],
          },
        ],
      },
    },
  };

  return response;
};

const getProduct = (products) => {
  const response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: products,
      },
    },
  };

  return response;
};

const handleProductApi = (res) => {
  const products = [];

  res.forEach((product, key) => {
    if (key <= 5) {
      const { name, slug, price, image } = product;
      products.push({
        title: name,
        subtitle: formatPrice(price),
        image_url: `${PATH_URL.BASE_URL_SERVER}admins/uploads/products/${image}`,
        buttons: [
          {
            type: "web_url",
            title: "Xem chi tiết",
            url: `${PATH_URL.BASE_URL_CLIENT}product/${slug}`,
            webview_height_ratio: "full",
          },
        ],
      });
    }
  });

  const resTemplate = getProduct(products);

  return resTemplate;
};

const getMenuProductList = () => {
  const response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Sản phẩm mới",
            subtitle: "Danh sách các sản phẩm mới",
            image_url: IMAGE_STARTED,
            buttons: [
              {
                type: "postback",
                title: "Xem sản phẩm",
                payload: "PRODUCT_NEW",
              },
            ],
          },
          {
            title: "Sản phẩm xem nhiều",
            subtitle: "Danh sách các sản phẩm xem nhiều nhất",
            image_url: IMAGE_STARTED,
            buttons: [
              {
                type: "postback",
                title: "Xem sản phẩm",
                payload: "PRODUCT_VIEW",
              },
            ],
          },
          {
            title: "Sản phẩm nỏi bật",
            subtitle: "Danh sách các sản phẩm nổi bật",
            image_url: IMAGE_STARTED,
            buttons: [
              {
                type: "postback",
                title: "Xem sản phẩm",
                payload: "PRODUCT_FEATHER",
              },
            ],
          },
        ],
      },
    },
  };

  return response;
};

const sendTypingOn = (sender_psid) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: "typing_on",
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

const sendMarkSeen = (sender_psid) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: "mark_seen",
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
const callSendAPI = async (sender_psid, response) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  await sendMarkSeen(sender_psid);
  await sendTypingOn(sender_psid);

  request(
    {
      uri: "https://graph.facebook.com/v12.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("Send success !!");
      } else {
        console.error("Send fail:" + err);
      }
    }
  );
};

const ChatbotService = {
  handleGetStarted: (sender_psid) => {
    return new Promise(async (resolve, reject) => {
      try {
        const username = await getUserName(sender_psid);
        const resText = {
          text: `Chàoo!!, Chào mừng bạn ${username} đến với MW Store`,
        };
        await callSendAPI(sender_psid, resText);

        const resTemplate = sendGetStartedTemplate();
        await callSendAPI(sender_psid, resTemplate);

        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  },

  handleProductNew: (sender_psid) => {
    productApi
      .getProductNew()
      .then((res) => {
        const resTemplate = handleProductApi(res.data);
        callSendAPI(sender_psid, resTemplate);
      })
      .catch((err) => {});
  },

  handleProductView: (sender_psid) => {
    productApi
      .getProductView()
      .then((res) => {
        const resTemplate = handleProductApi(res.data);
        callSendAPI(sender_psid, resTemplate);
      })
      .catch((err) => {});
  },

  handleProductFeather: (sender_psid) => {
    productApi
      .getProductFeather()
      .then((res) => {
        const resTemplate = handleProductApi(res.data);
        callSendAPI(sender_psid, resTemplate);
      })
      .catch((err) => {});
  },

  handleProductList: (sender_psid) => {
    return new Promise(async (resolve, reject) => {
      try {
        const resTemplate = getMenuProductList();
        await callSendAPI(sender_psid, resTemplate);

        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  },

  handleChatSimsimi: async (sender_psid, received_message) => {
    let response;
    await productApi
      .simsimiChat(received_message.text)
      .then((res) => {
        if (res.success) {
          response = {
            text: res.success,
          };
        }
      })
      .catch((err) => {});

    callSendAPI(sender_psid, response);
  },

  handleSendAttachments: async (sender_psid, received_message) => {
    const response = {
      text: "Định dạng không hợp lệ, vui lòng chọn lại !!!",
    };

    const atts = received_message.attachments[0];

    if (atts.type === "image") {
      const image = atts.payload.url;
      response.text = await OcrService.tesseract(image);
    }
    callSendAPI(sender_psid, response);
  },
};

export default ChatbotService;
