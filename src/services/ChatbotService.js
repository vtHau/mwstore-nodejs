require("dotenv").config();
import request from "request";
import productApi from "../apis/productApi";

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
              //them o day
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
        const products = res
          .filter((product, key) => key <= 5)
          .map((product) => {
            const { title, price, image } = product;
            const newProduct = {
              title: title,
              subtitle: price,
              image_url: image,
              buttons: [
                {
                  type: "web_url",
                  title: "Xem chi tiết",
                  url: "https://www.facebook.com/",
                  webview_height_ratio: "full",
                },
              ],
            };

            return newProduct;
          });

        const resTemplate = getProduct(products);
        callSendAPI(sender_psid, resTemplate);
      })
      .catch((err) => {});
  },

  handleProductView: (sender_psid) => {
    return new Promise(async (resolve, reject) => {
      try {
        const resTemplate = getProduct();
        await callSendAPI(sender_psid, resTemplate);

        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
  },

  handleProductFeather: (sender_psid) => {
    return new Promise(async (resolve, reject) => {
      try {
        const resTemplate = getProduct();
        await callSendAPI(sender_psid, resTemplate);

        resolve("done");
      } catch (e) {
        reject(e);
      }
    });
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
};

export default ChatbotService;
