require("dotenv").config();
import request from "request";
import productApi from "../apis/productApi";
import OcrService from "./OcrService";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_STARTED =
  "https://luv.vn/wp-content/uploads/2021/08/hinh-anh-gai-xinh-52.jpg";

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
                url: "https://www.facebook.com/MW-Store-108345978337846",
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
  products.push({
    title: "Quay về",
    subtitle: "Về lại danh mục sản phẩm",
    image_url: IMAGE_STARTED,
    buttons: [
      {
        type: "postback",
        title: "Quay về",
        payload: "PRODUCT_LIST",
      },
    ],
  });

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
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
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
    const products = [];

    productApi
      .getProductNew()
      .then((res) => {
        res.forEach((product, key) => {
          if (key <= 4) {
            const { title, price, image } = product;
            products.push({
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
            });
          }
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
    let response = {
      text: "Định dạng không hợp lệ, vui lòng chọn lại !!!",
    };

    const atts = received_message.attachments[0];

    let attachment_url = received_message.attachments[0].payload.url;
    console.log(received_message.attachments[0].type);
    console.log(received_message.attachments[0].payload);
    // if (atts[0].type === "image") {
    //   const image = atts[0].payload.url;
    //   response = await OcrService.tesseract(image);
    // }

    // const response = {
    //   attachment: {
    //     type: "template",
    //     payload: {
    //       template_type: "generic",
    //       elements: [
    //         {
    //           title: "Is this the right picture?",
    //           subtitle: "Tap a button to answer.",
    //           image_url: attachment_url,
    //           buttons: [
    //             {
    //               type: "postback",
    //               title: "Yes!",
    //               payload: "yes",
    //             },
    //             {
    //               type: "postback",
    //               title: "No!",
    //               payload: "no",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   },
    // };

    callSendAPI(sender_psid, response);
  },
};

export default ChatbotService;
