import { sendNotificationToClient } from "./../services/notify";

const NotificationController = {
  testSend: (req, res) => {
    try {
      const tokens = [
        "dyqxz4yRXzhjtTkl5Aqz5a:APA91bF31c9vCblY-nPgr2iDDWtQ9P3acnQUhkTHWD8nEiikz00Hz_oSxOyLh6tnbN1zXFGzdaZplnXpBJ3cB896Xgcg3olr0hiwTPQ9kBI62JNOJTjv89cpAnldITQzdv693jyp6geA",
      ];
      const notificationData = {
        title: "New message",
        body: "xin chao nef",
      };
      sendNotificationToClient(tokens, notificationData);
      // res.status(200).json({ messages: data.rows });
    } catch (err) {
      // res.status(200).json({ messages: err.stack });
    }
  },
};

export default NotificationController;
