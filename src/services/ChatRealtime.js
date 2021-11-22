import messageApi from "./../apis/messageApi";

const ChatRealtime = async (io) => {
  io.on("connection", (socket) => {
    console.log(`User join chat, socketID: ${socket.id}`);

    socket.on("send_message", async (data) => {
      console.log("data: ", data);

      try {
        await messageApi.postMessage(data);
        socket.broadcast.emit("receive_message", data);
      } catch (error) {}
    });

    socket.on("keyboard_message_send", (data) => {
      console.log("data: ", data);
      socket.broadcast.emit("keyboard_message_receive", data);
    });
  });
};

export default ChatRealtime;
