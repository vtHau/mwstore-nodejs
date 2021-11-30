import messageApi from "../apis/messageApi";

const socketIOService = async (io) => {
  io.on("connection", (socket) => {
    console.log(`User join chat, socketID: ${socket.id}`);

    socket.on("send_message", async (data) => {
      console.log("data: ", data);

      try {
        await messageApi.postMessage(data);
        socket.broadcast.emit("receive_message", data);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("keyboard_message_send", (data) => {
      console.log("data: ", data);
      socket.broadcast.emit("keyboard_message_receive", data);
    });

    socket.on("send_notification", (data) => {
      console.log("send_notification: ", data);
      socket.broadcast.emit("receive_notification", data);
    });
  });
};

export default socketIOService;
