const User = require("./models/userModel");

const socketConnection = (server) => {
  // Establish the socket connection
  const io = require("socket.io")(server, {
    pingTimeout: 60000, // wait 60sec to goes off the socket connection.
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    // console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
      //User connected
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      // Here room is equivalent to chat._id
      // User joined the chat room
      socket.join(room);
      // console.log("User Joined Chat: " + room);
    });

    socket.on("new message", (newMsgReceived) => {
      // New msg received from client side
      const chat = newMsgReceived.chat;
      if (!chat.users) return console.log("chat.users not defined!");

      const usersIdArr = chat.users
        .map((user) => user._id)
        .filter((userId) => userId != newMsgReceived.sender._id);

      usersIdArr.forEach(async (userId) => {
        if (io.sockets.adapter.rooms.has(userId)) {
          socket.in(userId).emit("message received", newMsgReceived);
        } else {
          await User.findByIdAndUpdate(userId, {
            $push: { msgNotifications: newMsgReceived._id },
          });
        }
      });
    });

    socket.on("typing", (room, username) =>
      socket.in(room).emit("typing", username, room)
    );
    socket.on("stop typing", (room) =>
      socket.in(room).emit("stop typing", room)
    );

    socket.off("setup", () => {
      //   console.log("User Disconnected!");
      socket.leave(userData._id);
    });

    // socket.on("disconnecting", () => {
    //   console.log(socket.rooms); // the Set contains at least the socket ID
    // });

    socket.on("disconnect", () => {
      // socket.rooms.size === 0
      //   console.log("disconnected");
    });
  });
};

module.exports = socketConnection;
