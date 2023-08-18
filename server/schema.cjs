const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const chatsSchema = new Schema({
  headingName: String,
  name: String,
  chatType: {
    type: String,
    enum: ["public", "private"],
  },
  password: String,
  messages: [{ sender: String, text: String, sentAt: Date }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
const Chat = mongoose.model("Chat", chatsSchema);

module.exports = { User, Chat };
