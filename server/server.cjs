const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { Chat } = require("./schema.cjs");
const { login, signup, authorizeToken } = require("./controllers.cjs");
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://muhammadaljoufi:${process.env.DB_PASSWORD}@chatcluster.pr6erxq.mongodb.net/app?retryWrites=true&w=majority`
  )
  .then(() => console.log("connection to database made!"))
  .catch((err) => console.log(err));

/*TASKS
1- Fetching messages
2- Fetching Chatlist
3- Adding messages to database along with time
4- Login from database
5- Add user upon sign up in datbase */

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.get("/chatNamesList", async (_, res) => {
  // return certain fields from messages
  const chatNamesList = await Chat.find().select([
    "headingName",
    "name",
    "chatType",
  ]);
  res.status(200).json({
    status: "success",
    data: chatNamesList,
  });
});
app.get("/:chatName", authorizeToken, async (req, res) => {
  const { chatName } = req.params;
  // returns an object, then we destructure the messages property from it
  const { messages } = await Chat.findOne({ name: chatName }).select(
    "messages"
  );

  res.status(200).json({
    data: messages,
  });
});

app.post("/signup", signup);
app.post("/login", login);

io.on("connection", (socket) => {
  // everyone joins the public chat
  socket.join("chat-public");

  socket.on("message", async (newMessage) => {
    const { text, sender, chatName } = newMessage;
    newMessage.sentAt = new Date();

    await Chat.updateOne(
      { name: chatName },
      { $push: { messages: newMessage } }
    );

    // SHOW NEW MESSAGE TO OTHERS
    io.in(`chat-${chatName}`).emit("update-messages", {
      text,
      sender,
    });
  });

  socket.on("join-private", async ({ chatName, password }) => {
    let message, status;
    const { password: chatPassword } = await Chat.findOne({
      name: chatName,
    }).select("password");
    if (password === chatPassword) {
      socket.join(`chat-${chatName}`);
      status = "sucess";
      message = `Joined Private Chat Sucessfully!`;
    } else {
      status = "failure";
      message = "Invalid Chat Password";
    }
    socket.emit("private-joined", { status, message });
  });
});

server.listen(process.env.PORT, () => {
  console.log("Connection made to the server!");
});
