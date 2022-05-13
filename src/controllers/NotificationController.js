import notificationApi from "../apis/notificationApi";
import { sendNotificationToClient } from "./../services/notify";

const NotificationController = {
  sendNotification: async (req, res) => {
    const { title, body, type, user_id } = req.body;
    const notification = { title, body };
    let tokens = [];

    if (type === "ONE_USER") {
      try {
        const resp = await notificationApi.getToken({ user_id });
        if (resp.status === "SUCCESS") {
          tokens = resp.data.map((token) => token.token);
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (type === "ALL_USER") {
      try {
        const resp = await notificationApi.getAllToken();
        if (resp.status === "SUCCESS") {
          tokens = resp.data.map((token) => token.token);
        }
      } catch (err) {
        console.log(err);
      }
    }

    sendNotificationToClient(tokens, notification);
    return res.json({ status: "SUCCESS" });
  },
};

export default NotificationController;
